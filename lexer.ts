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
// Definicao class lexica (geradora de tokens)
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
    private errorPointers: string[] = [],
    private errorMsgs: string[] = []

  ){}

  /**
   * Funcao que reconhece os tokens segundo a stream de entrada vinda de um arquivo .cic.
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
      this.errorPointers = []
      this.errorMsgs = []
      for(let c = 0; c < line.length; c++){
        c = rewind ? c-1 : c
        rewind = false
        state = this.nextState(state, line[c])
        // Estados de rejeicao
        if(!state.key){
          if(/[^\n ]/.test(line[c]))
            this.setErrorOnSource(state,token.length, lineCounter, c)
          token = ''
          state = this.getStartState()
          continue
        }
        // Estados de erro
        if(state.err) {
          this.setErrorOnSource(state, token.length,lineCounter, c)
          token = ''
          state = this.getStartState()
          rewind = state.pathHadWedding ? true : false
          continue
        }
        // Estados nao finais 
        if(!state.final){
          if(lineCounter === EOF.posLine && c === EOF.posCol){
            state = this.nextState(state, '$')
            this.setErrorOnSource(state, 0, lineCounter, c)
          }
          token += line[c] !== '\n' ? line[c] : ''
          continue
        }
        // Estados finais
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
          this.setErrorOnSource(state, token.length, lineCounter, c)
        }
        
        token = ''
        state = this.getStartState()
      }
      lineCounter++
      this.sourceCodeErrorReport += this.errorPointers.join('')
      this.sourceCodeErrorReport += this.errorMsgs.join('')
    }

    return tokens
  }
  /**
   * Funcao realiza a leitura do arquivo de entrada .cic.
   * @param {string} path caminho do arquivo
   * @returns {Promise<{fileLines: AsyncIterable<string>, EOF: {posLine: number, posCol: number}}>} 
   * a funcao retorna um objeto contendo as linhas e o final do arquivo 
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
   * @returns {TState} proximo estado do automato
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
   * Metodo acha na lista de estados, o incial, caso nao exista tal estado ela dispara um erro.
   * @returns {TState} a funcao retorna o estado inicial do automato
  */
  private getStartState(): TState{
    const startState: TState | undefined = Lexer.states.find(state => state.start === true) 
    if(!startState) throw new Error('Nao foi possivel achar o estado inicial do automato.')
    return startState
  }
  /**
   * Metodo para acessar o codigo com os erros encontrados
   * @returns {string} a funcao retorna uma string
  */
  public getSourceCodeErrors(): string {return this.sourceCodeErrorReport}
  /**
   * Metodo para montar uma string que representa o codigo com os erros encontrados
   * @param {TState} state estado atual
   * @param {number} tokenSize tamanho do possivel token lido
   * @param {number} line linha como um numero 
   * @param {number} col coluna como um numero
   * @returns {void} seta o valor de this.sourceCodeErrorReport, sem retorno
  */
  private setErrorOnSource(state: TState, tokenSize: number,line: number, col: number): void{
    let errorPointer: string = ''
    const errorMsg: string | undefined = state.err?.msg 
    const errorCol: number = state.err?.err_str ? col : col - tokenSize + 1
    let newError: string = ''
    newError += newError.padStart(`[${line}]`.length) +
    `Erro linha ${line} coluna ${errorCol}: ${errorMsg ? errorMsg : 'Simbolo/Reservada nao reconhecivel'}\n`

    
    errorPointer += errorPointer.padStart(`[${line}]`.length)
    for(let i = 0; i < errorCol; i++)
      errorPointer += '-'
    errorPointer += '^\n'

    this.errorPointers.push(errorPointer)
    this.errorMsgs.push(newError)
  }
  /**
   * Metodo usado para setar o lexema apenas para os tokens que podem te-los
   * @param {string} tokenType string que corresponde ao nome do token
   * @param {string} value valor do token
   * @returns {string | undefined} retorna uma string que representa o lexama ou undefined se nao exister para aquele token
  */
  private getLexeme(tokenType: string, value: string): string | undefined{
    return Lexer.canHaveLexeme.includes(TokenFamily[tokenType]) ? value : undefined
  }
}

