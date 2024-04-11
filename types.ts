// Tipo/Familia de um token
enum TokenFamily {
  Integer,
  Float
}
// Estrutura de um token
type TToken = {
  type: string
  value?: string
}
// Estrutura de um estado
type TState = {
  key: string
  start?: boolean
  final?: boolean
  tokenType?: TokenFamily
}
// Estrutura da base de comparacao de caracter
type TCharTypeMapping = {
  regex: RegExp
  type: string
}
// Estrutura da mesa de transicoes
type TTransitionTable = {
  [stateKey: string]: {
    [transitionSymbol: string]: string
  }
}

export {
  TToken,
  TState,
  TCharTypeMapping,
  TTransitionTable,
  TokenFamily
}