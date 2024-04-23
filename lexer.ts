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
  /**
   * Inicia a classe lexica com as constantes importadas do arquivo de constantes.
   * @param {TCharTypeMapping[]} charTypeMappings array de regex e seu tipo
   * @param {TState[]} states estados do automato !! DEVE HAVER UM ESTADO INICIAL !!
   * @param {TTransitionTable} transitionTable mesa de transicao de modo que estado: {symbolo -> proxEstado}
   * @returns {} a funcao eh um construtor, inicia a classe, sem retorno.
  */
  constructor(
    private keywords: TKeyword[] = words,
    private charTypeMappings: TCharTypeMapping[] = charType,
    private states: TState[] = s,
    private transitionTable: TTransitionTable = table
  ){}
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
    
    let lineCounter: number = 1    
    for await (const lineFromFile of (await this.readFile(inputPath)).readLines()){
      const line = lineFromFile.includes('\n') ? lineFromFile : lineFromFile + '\n'
      for(let c = 0; c < line.length; c++){
        c = rewind ? c-1 : c
        rewind = false
        state = this.nextState(state, line[c])
        if(state.key === 'rejected'){
          console.log(`Unrecognized Token '${this.format(line[c])}' at line[${lineCounter}], col[${c+1}]`) 
          token = ''
          state = this.getStartState()
          continue
        }
        
        if(!state.final){
          token += line[c] !== '\n' ? line[c] : ''
          continue
        }

        let value: string

        if(state.fromWedding) {
          rewind = line[c] === '\n' ? false : true
          value = token
        }
        else value = token + line[c]
        
        tokens.push({
          tokenKind: state.key === 'keywords' ? TokenFamily[this.keywords.find(k => k.value === token)?.tokenType as TokenFamily] : TokenFamily[state.tokenType as TokenFamily],
          lexeme: value
        })

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
  private async readFile(path: string): Promise<fsPromises.FileHandle> {
    try {
      return await fsPromises.open(path, 'r');
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
    for (const { regex, type } of this.charTypeMappings){
      if(!this.transitionTable[state.key][type]) continue
      if (regex.test(c)) {
        return this.states.find(
          (s) => s.key === this.transitionTable[state.key][type]
        ) as TState
      }
    }
  
    return {
      key: 'rejected'
    }
  }
  /**
   * Funcao acha na lista de estados, o incial, caso nao exista tal estado ela dispara um erro.
   * @returns {TState} a funcao retorna o estado inicial do automato
  */
  private getStartState(): TState{
    const startState: TState | undefined = this.states.find(state => state.start === true) 
    if(!startState) throw new Error('It was not possible to find the initial state of the automaton.')
    return startState
  }
  /**
   * Formata string, se o caracter for '\n', mostra como caracter nao como a quebra de linha
   * @param {string} str string para teste
   * @returns {string} a funcao retorna a string formatada
  */
  private format(str: string): string { return str.localeCompare('\n') === 0 ? '\\n' : str}
}

