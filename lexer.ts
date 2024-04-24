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
  private static canHaveLexeme: TokenFamily[] = [
    TokenFamily.TK_INT,
    TokenFamily.TK_FLOAT,
    TokenFamily.TK_END,
    TokenFamily.TK_ID,
    TokenFamily.TK_CADEIA, 
    TokenFamily.TK_DATA 
  ]
  constructor(
    private sourceCodeErrorReport: string = '',
    private lastErrorLine: string = '',
  ){}

  /**
   * Funcao que reconhece os tokens segundo a stream de entrada vinda de um arquivo .txt.
   * @param {string} inputPath caminho para o arquivo
   * @returns {Promise<TToken[]>} a funcao retorna uma lista com todos os tokens reconhecidos
  */
  public async tokenize(inputPath: string): Promise<TToken[]> {
    const tokens: TToken[] = [] 
    const {fileLines, EOF} = (await this.readFile(inputPath))
    let rewind: boolean = false
    let token: string = ''
    
    let lineCounter: number = 1
    let state: TState = this.getStartState()

    for await (const fileLine of fileLines){
      const line = fileLine.includes('\n') ? fileLine : fileLine + '\n'
      this.sourceCodeErrorReport += `[${lineCounter}] ${line}`
      for(let c = 0; c < line.length; c++){
        c = rewind ? c-1 : c
        rewind = false
        state = this.nextState(state, line[c])
        
        if(!state.key){
          if(/[^\n ]/.test(line[c]))
            this.setErrorOnSource(state,token.length, lineCounter, c)
          token = ''
          state = this.getStartState()
          continue
        }
        
        if(state.err) {
          this.setErrorOnSource(state, token.length,lineCounter, c)
          token = ''
          state = this.getStartState()
          rewind = state.pathHadWedding ? true : false
          continue
        }
        
        if(!state.final){
          if(lineCounter === EOF.posLine && c === EOF.posCol){
            state = this.nextState(state, '$')
            this.setErrorOnSource(state, 0, lineCounter, c)
          }
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
            lexeme: this.getLexeme(tk, value),
            lin: lineCounter,
            col: c+1 -(value.length > 1 ? value.length : 0) 
          }) :
          this.setErrorOnSource(state, token.length,lineCounter, c)
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
      throw new Error('Erro ao abrir arquivo: ' + error)
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
    if(!startState) throw new Error('Nao foi possivel achar o estado inicial do automato.')
    return startState
  }
  /**
   * Formata string, se o caracter for '\n', mostra como caracter nao como a quebra de linha
   * @param {string} c caracter para teste
   * @returns {string} a funcao retorna a string formatada
  */
  private format(c: string): string { return c.localeCompare('\n') === 0 ? '\\n' : c}
  public getSourceCodeErrors(): string {return this.sourceCodeErrorReport}
  private setErrorOnSource(state: TState, tokenSize: number,line: number, col: number): void{
    let errorPointer: string = ''
    const errorMsg: string | undefined = state.err?.msg 
    const errorCol: number = errorMsg?.includes('Cadeia') ? col : col - tokenSize + 1
    const newError: string = 
    `   Erro linha ${line} coluna ${errorCol}: ${errorMsg ? errorMsg : 'Simbolo nao reconhecido'}\n`

    this.sourceCodeErrorReport += '   '
    for(let i = 0; i < errorCol; i++)
      errorPointer += '-'
    errorPointer += '^\n'

    this.sourceCodeErrorReport += errorPointer
    
    if(this.lastErrorLine === '') this.sourceCodeErrorReport += newError
    if(this.lastErrorLine.includes(line.toString())){
      this.sourceCodeErrorReport.replace(this.lastErrorLine, errorPointer)
      this.sourceCodeErrorReport += this.lastErrorLine
      this.sourceCodeErrorReport += newError
    } 

    this.lastErrorLine = newError
  }
  private getLexeme(tokenType: string, value: string): string | undefined{
    return Lexer.canHaveLexeme.includes(TokenFamily[tokenType]) ? value : undefined
  }
}

