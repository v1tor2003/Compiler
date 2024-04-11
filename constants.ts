import { 
  TCharTypeMapping, 
  TState, 
  TTransitionTable, 
  TokenFamily 
} from "./types"

// Base de comparacao do tipo de caracter
const charType: TCharTypeMapping[] = [
  { regex: /[0-9]/, type: 'digit' },
  { regex: /^\./, type: 'dot'},
  { regex: /\e/, type: 'e' },
  { regex: /\-/, type: 'hifen' },
  { regex: /^[^\d.]$/, type: '!digit!dot'},
  { regex: /[^0-9]/, type: '!digit'}
]

// Estados para aceitacao de Int e Float
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
    '!digit!dot': 'q6',
    'e': 'q4'
  },
  'q62': {
    'digit': 'q2'
  },
  'q3': {
    '!digit!dot': 'q6',
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