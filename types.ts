// Tipo/Familia de um token
enum TokenFamily {
  Inteiro,
  Float,
  End,
  Cadeia,
  LogicoOR,
  LogicoAND,
  LogicoNOT,
  Divisao,
  Multiplicacao,
  Soma,
  Subtracao,
  Diferenca,
  Comparacao,
  Atribuicao,
  Menor,
  MenorIgual,
  Maior,
  MaiorIgual,
  ComentarioBloco,
  ComentarioLinha,
  Data,
  Reservada,
  Identificador,
  RotinaInicio,
  RotinaFim,
  Se,
  Senao,
  Imprima,
  Leia,
  Para,
  Enquanto,
  DoisPontos,
  AbrirParen,
  FecharParen
}
// Estrutura de um token
type TToken = {
  tokenKind: string
  lexeme?: string
}
// Estrutura de um estado
type TState = {
  key: string
  start?: boolean
  final?: boolean
  fromWedding?: boolean
  tokenType?: TokenFamily
}
// Estrutura da base de comparacao de caracter
type TCharTypeMapping = {
  regex: RegExp
  type: string
}

// Estrutura de uma palavra chave
type TKeyword = {
  tokenType: TokenFamily
  value: string
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
  TKeyword,
  TokenFamily
}