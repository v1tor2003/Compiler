import { 
  TCharTypeMapping, 
  TState, 
  TTransitionTable, 
  TokenFamily 
} from "./types"

// Base de comparacao do tipo de caracter
// composta por um vetor de literais tal que {regex para teste, tipo correspondente}
const charType: TCharTypeMapping[] = [
  { regex: /[0-9]/, type: 'digit' },
  { regex: /[^0-9]/, type: '!digit'},
  { regex: /\./, type: 'dot'},
  { regex: /[^.]/, type: '!dot'},
  { regex: /\e/, type: 'e' },
  { regex: /\-/, type: 'hifen' },
  { regex: /[^0-9.]/, type: '!digit!dot'},
  { regex: /[^0-9e]/, type: '!digit!e'}
]

// Estados para aceitacao de Int e Float
// apenas o inical possui como valida a propriedade de inicio
// varios estados podem ser finais, quando finais devem possuir seu tipo
const states: TState[] = [
  {
    key: 'q0',
    start: true,
  },
  { key: 'q1' },
  { key: 'q2' },
  { key: 'q3' },
  { key: 'q4' },
  { key: 'q5' },
  {
    key: 'q6',
    final: true,
    tokenType: TokenFamily.Float
  },
  { key: 'q7' },
  { key: 'q8' },
  { key: 'q9' },
  { key: 'q10' },
  {
    key: 'q11',
    final: true,
    tokenType: TokenFamily.Integer
  },
  { key: 'q62'}
]

// Transicoes para aceitacao de Int e Float
// a mesa é um objeto onde cada chave eh um estado com suas possiveis transicoes e
// respectivos destinos, (o estado de rejeicao esta no codigo, ele eh atigido quando nao existir
// transicao do estado de teste para o dado tipo do caracter)

const table: TTransitionTable = {
  'q0': {
    'digit' : 'q1',
    'dot' : 'q62'
  },
  'q1': {
    '!digit!dot': 'q11',
    'digit':'q8',
    'dot':'q2'
  },
  'q2': {
    'digit': 'q3',
    '!digit!e': 'q6',
    'e': 'q4'
  },
  'q62': {
    'digit': 'q2'
  },
  'q3': {
    '!digit!e': 'q6',
    'digit': 'q3',
    'e': 'q4'
  },
  'q4': {
    'digit': 'q7',
    'hifen':'q5'
  },
  'q5': {
    'digit': 'q7'
  },
  'q6': {},
  'q7': {
    'digit':'q7',
    '!digit!dot': 'q6'
  },
  'q8': {
    'digit': 'q9',
    '!digit!dot': 'q11',
    'dot': 'q2'
  },
  'q9': {
    'digit': 'q10',
    '!digit!dot': 'q11',
    'dot': 'q2'
  },
  'q10': {
    'digit': 'q10',
    '!digit': 'q11',
  },
  'q11': {},
}

export { charType, states, table }