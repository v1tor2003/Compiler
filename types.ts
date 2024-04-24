// Tipo/Familia de um token
enum TokenFamily {
  TK_INT,
  TK_FLOAT,
  TK_END,
  TK_CADEIA,
  TK_OR,
  TK_AND,
  TK_NOT,
  TK_DIV,
  TK_MULT,
  TK_MAIS,
  TK_MENOS,
  TK_DIF,
  TK_COMP,
  TK_ATRIB,
  TK_MENOR,
  TK_MENOR_IGUAL,
  TK_MAIOR,
  TK_MAIOR_IGUAL,
  TK_DATA,
  TK_RESERVADA,
  TK_ID,
  TK_ROTINA,
  TK_FIM_ROTINA,
  TK_SE,
  TK_SENAO,
  TK_IMPRIMA,
  TK_LEIA,
  TK_PARA,
  TK_ENQUANTO,
  TK_DOIS_PONTOS,
  TK_ABRE_PAR,
  TK_FECHA_PAR
}
// Estrutura de um token
type TToken = {
  tokenKind: string
  lexeme?: string
  lin: number
  col: number
}
// Estrutura de um estado
type TState = {
  key: string
  start?: boolean
  final?: boolean
  pathHadWedding?: boolean
  err?: {
    msg: string
  } | undefined
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