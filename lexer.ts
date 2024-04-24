import * as fsPromises from 'fs/promises'
import {
  TState,
  TCharTypeMapping,
  TToken,
  TTransitionTable,
  TokenFamily,
  TKeyword
} from './types'
import { charType, keywords as words, states as s, table } from './constants'

export class Lexer {
  private static keywords: TKeyword[] = words
  private static charTypeMappings: TCharTypeMapping[] = charType
  private static states: TState[] = s
  private static transitionTable: TTransitionTable = table
  
  constructor(private sourceCodeErrorReport: string = ''){}

  /**
   * Funcao que reconhece os tokens segundo a stream de entrada vinda de um arquivo .txt.
   * @param {string} inputPath caminho para o arquivo
   * @returns {Promise<TToken[]>} a funcao retorna uma lista com todos os tokens reconhecidos
  */
  public async tokenize(inputPath: string): Promise<TToken[]> {
    const tokens: TToken[] = [] 
    let state: TState = this.getStartState()
    let rewind: boolean = false
    let token: string = ''
    const {fileLines, EOF} = (await this.readFile(inputPath))
    
    let lineCounter: number = 1    
    for await (const fileLine of fileLines){
      const line = fileLine.includes('\n') ? fileLine : fileLine + '\n'
      this.sourceCodeErrorReport += `[${lineCounter}] ${line}`
      for(let c = 0; c < line.length; c++){
        c = rewind ? c-1 : c
        rewind = false
        state = this.nextState(state, line[c])
        
        if(!state.key){
          if(/[^\n ]/.test(line[c]))
            this.setErrorOnSource('Simbolo nao reconhecivel', lineCounter, c)
          token = ''
          state = this.getStartState()
          continue
        }
        
        if(state.err) {
          this.setErrorOnSource(state.err.msg, lineCounter, c)
          token = ''
          state = this.getStartState()
          rewind = state.pathHadWedding ? true : false
          continue
        }

        if(!state.final){
          token += line[c] !== '\n' ? line[c] : ''
          continue
        }
        // passou por todos estados, ta no final    
        let value: string

        if(state.pathHadWedding) {
          rewind = line[c] === '\n' ?  false :true
          value = token
        }
        else value = token + line[c]
        
        if(state.tokenType !== undefined) {
          let tk = (state.tokenType === TokenFamily.TK_RESERVADA) ? TokenFamily[Lexer.keywords.find(k => k.value === token)?.tokenType as TokenFamily] : TokenFamily[state.tokenType as TokenFamily]
          
          tk !== undefined ? tokens.push({
            tokenKind: tk,
            lexeme: value
          }) :
          this.setErrorOnSource('Palavra reservada nao encontrada', lineCounter, c)
        }

        token = ''
        state = this.getStartState()
      }
      lineCounter++
    }

    return tokens
  }
  /**
   * Funcao realiza a leitura do arquivo de entrada .txt.
   * @param {string} path caminho do arquivo
   * @returns {Promise<fsPromises.FileHandle>} a funcao retorna um handler para o arquivo 
  */
  private async readFile(path: string): Promise<{fileLines: AsyncIterable<string>, EOF: {posLine: number, posCol: number}}> {
    try {
      const counterHandler = await fsPromises.open(path, 'r');
      const linesOfFile = counterHandler.readLines()
      
      let linesCount: number = 0
      let charCount: number = 0
      for await(const l of linesOfFile){
        linesCount++
        charCount = 0
        for(const c of l)
          charCount++
      }

      await counterHandler.close();
      const fileHandler = await fsPromises.open(path, 'r');

      return {fileLines: fileHandler.readLines(), EOF: {posLine: linesCount, posCol: charCount}}
    } catch (error: unknown) {
      throw new Error('Error opening file: ' + error)
    }
  }
  /**
   * Dado o estado atual, verifica na lista de regex se existe transicao no estado
   * para aquele tipo de caracter e se sim transiciona
   * em caso de nao existir tal transicao o estado de retorno eh o de rejeicao
   * @param {TState} state estado atual do automato
   * @param {string} c caracter atual da stream de leitura
   * @returns {TState} a funcao retorna o proximo estado
  */
  private nextState(state: TState, c: string): TState{
    for (const { regex, type } of Lexer.charTypeMappings){
      if(!Lexer.transitionTable[state.key][type]) continue
      if (regex.test(c)) {
        return Lexer.states.find(
          (s) => s.key === Lexer.transitionTable[state.key][type]
        ) as TState
      }
    }
  
    return { key: '' }
  }
  /**
   * Funcao acha na lista de estados, o incial, caso nao exista tal estado ela dispara um erro.
   * @returns {TState} a funcao retorna o estado inicial do automato
  */
  private getStartState(): TState{
    const startState: TState | undefined = Lexer.states.find(state => state.start === true) 
    if(!startState) throw new Error('It was not possible to find the initial state of the automaton.')
    return startState
  }
  /**
   * Formata string, se o caracter for '\n', mostra como caracter nao como a quebra de linha
   * @param {string} c caracter para teste
   * @returns {string} a funcao retorna a string formatada
  */
  private format(c: string): string { return c.localeCompare('\n') === 0 ? '\\n' : c}
  private isAtEndOfFIle(c: {posLine: number, posCol: number}, EOF: {posLine: number, posCol: number}): boolean {
    return (c.posLine === EOF.posLine) && (c.posCol === EOF.posCol)
  }
  public getSourceCodeErrors(): string {return this.sourceCodeErrorReport}
  private setErrorOnSource(errorMsg: string, line: number, col: number): void{
    this.sourceCodeErrorReport += '   '
    for(let i = 0; i < col; i++) this.sourceCodeErrorReport += '-'
    this.sourceCodeErrorReport += '^\n'
    this.sourceCodeErrorReport += `   Erro ${line} coluna ${col}: ${errorMsg}\n`
  }
}

