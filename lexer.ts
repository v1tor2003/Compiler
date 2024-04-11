import * as fsPromises from 'fs/promises'
import {
  TState,
  TCharTypeMapping,
  TToken,
  TTransitionTable,
  TokenFamily
} from './types'
import { charType, states as s, table } from './constants'

export class Lexer {
  /**
   * Inicia a classe lexica com as constantes importadas do arquivo de constantes.
   * @param {TCharTypeMapping[]} charTypeMappings regexs para identificacao do simbolo para transicao
   * @param {TState[]} states todos os estados do automato
   * @param {TTransitionTable} transitionTable mesa de transicao onde cada uma eh um objeto literal de estado: {symbolo -> proxEstado}
   * @returns {} a funcao eh um construtor, sem retorno.
  */
  constructor(
    private charTypeMappings: TCharTypeMapping[] = charType,
    private states: TState[] = s,
    private transitionTable: TTransitionTable = table
  ){}
  /**
   * Funcao que reconhece os tokens de um arquivo de entrada.
   * @param {string} inputPath caminho para a stream de string da entrada
   * @returns {Promise<TToken[]>} a funcao retorna uma lista com todos os tokens reconhecidos
  */
  public async tokenize(inputPath: string): Promise<TToken[]> {
    const tokens: TToken[] = [] 
    let state: TState = this.getStartState()

    let line: number = 1    
    for await (const l of (await this.readFile(inputPath)).readLines()){
      let col: number = 1
      let lexeme: string = ''
      for(const c of l){
        lexeme += c
        state = this.nextState(state, c)
        
        if(state.key === 'rejected'){
          console.log(`Unrecognized Token '${lexeme}' at line[${line}], col[${col}]`) 
          lexeme = ''
          state = this.getStartState()
        }

        if(state.final) {
          tokens.push({
            type: TokenFamily[state.tokenType as TokenFamily],
            value: lexeme.slice(0, -1)
          })

          lexeme = ''
          state = this.getStartState()
        }
        col++
      }
      line++
    }

    return tokens
  }
  /**
   * Funcao realiza a leitura do arquivo de entrada .txt.
   * @param {string} path caminho do arquivo
   * @returns {Promise<fsPromises.FileHandle>} a funcao retorna um handler para o arquivo que depois pode ser encarado como uma lista de strings
  */
  private async readFile(path: string): Promise<fsPromises.FileHandle> {
    try {
      return await fsPromises.open(path, 'r');
    } catch (error: unknown) {
      throw new Error('Error opening file: ' + error)
    }
  }
  /**
   * Funcao realiza a leitura do arquivo de entrada .txt.
   * @param {TState} state estado qualquer do automato
   * @param {string} c caracter atual da stream de leitura
   * @returns {TState} a funcao retorna o proximo estado ou 'rejected' se nao existir transicoes do atual simbolo com atual estado
  */
  private nextState(state: TState, c: string): TState{
    const cTypes = this.getSymbolTypes(c)

    let stateKey: string = ''
    for(let i = 0; i < cTypes.length; i++){
      stateKey = this.transitionTable[state.key][cTypes[i]]
      if(stateKey) return this.states.find(state => state.key === stateKey) as TState
    }
  
    return {
      key: 'rejected'
    }
  }
  /**
   * Funcao acha, na lista de estados, o estado com a propriedade start marcada como verdade.
   * @returns {TState} a funcao retorna o estado inicial do automato
  */
  private getStartState(): TState{
    const startState: TState | undefined = this.states.find(state => state.start === true) 
    if(!startState) throw new Error('It was not possible to find the initial state of the automaton.')
    return startState
  }
  /**
   * Funcao verifica e se sucesso, adiciona todos os tipo do caracter a uma lista.
   * @param {string} char caracter atual da stream de leitura
   * @returns {string[]} a funcao retorna uma lista com todos os tipos de caracter
  */
  private getSymbolTypes(char: string): string[]{
    let types: string[] = []
    for (const { regex, type } of this.charTypeMappings)
      if (regex.test(char)) types.push(type)
      

    return types
  }
}

