import { 
  TCharTypeMapping, 
  TKeyword, 
  TState, 
  TTransitionTable, 
  TokenFamily 
} from "./types"
// Palavras reservadas da linguagem definidas nas intrucoes do classroom
const keywords: TKeyword[] = [
  { tokenType: TokenFamily.RotinaInicio, value: 'rotina' },
  { tokenType: TokenFamily.RotinaFim, value: 'fim_rotina' },
  { tokenType: TokenFamily.Se, value: 'se' },
  { tokenType: TokenFamily.Senao, value: 'senao' },
  { tokenType: TokenFamily.Imprima, value: 'imprima' },
  { tokenType: TokenFamily.Leia, value: 'leia' },
  { tokenType: TokenFamily.Para, value: 'para' },
  { tokenType: TokenFamily.Enquanto, value: 'enquanto' },
] 

// Base de comparacao do tipo de caracter
// composta por um vetor de literais tal que {regex para teste, tipo correspondente}
const charType: TCharTypeMapping[] = [
  { regex: /[0-9]/, type: 'digit' },
  { regex: /[^0-9]/, type: '!digit'},
  { regex: /\./, type: 'dot'},
  { regex: /[^.]/, type: '!dot'},
  { regex: /\e/, type: 'e' },
  { regex: /\_/, type: 'underscore' },
  { regex: /\"/, type: 'quotes'},
  { regex: /\|/, type: 'pipe'},
  { regex: /\&/, type: 'ampersand'},
  { regex: /\~/, type: 'not'},
  { regex: /\%/, type: 'div'},
  { regex: /\*/, type: 'mult'},
  { regex: /\+/, type: 'sum'},
  { regex: /\-/, type: 'sub'},
  { regex: /\</, type: 'less'},
  { regex: /\>/, type: 'greater'},
  { regex: /\//, type: 'slash'},
  { regex: /\(/, type: 'openparen'},
  { regex: /\)/, type: 'closeparen'},
  { regex: /\:/, type: 'colon'},
  { regex: /[A-Z]/, type: 'upletter'},
  { regex: /[a-z]/, type: 'lowerletter'},
  { regex: /[0-9A-F]/, type: 'hexsymbol'},
  { regex: /[^0-9A-F]/, type: '!hexsymbol'},
  { regex: /[^>]/, type: '!greater'},
  { regex: /\=/, type: 'equals'},
  { regex: /\#/, type: 'hashtag'},
  { regex: /\x/, type: 'x'},
  { regex: /\n/, type: 'endl'},
  { regex: /[^=]/, type: '!equals'},
  {regex: /[^a-zA-F]/, type: '!lowerletter!upletter'},
  { regex: /[^<>=]/, type:'!less!greater!equals'},
  { regex: /[^a-z_]/, type: '!lowerletter!underscore'},
  { regex: /[^\n]/, type: '!endl'},
  { regex: /[^0-9.]/, type: '!digit!dot'},
  { regex: /[^0-9.x]/, type: '!digit!dot!x'},
  { regex: /[^0-9./]/, type: '!digit!dot!slash'},
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
    fromWedding: true,
    tokenType: TokenFamily.Float
  },
  { key: 'q7' },
  { key: 'q8' },
  { key: 'q9' },
  { key: 'q10' },
  {
    key: 'q11',
    final: true,
    fromWedding: true,
    tokenType: TokenFamily.Inteiro
  },
  { key: 'q12' },
  { key: 'q13' },
  { 
    key: 'q14',
    final: true,
    fromWedding: true,
    tokenType: TokenFamily.End
  },
  { key: 'q15' },
  { key: 'q16' },
  { key: 'q17' },
  { key: 'q18' },
  { key: 'q19' },
  { key: 'q20' },
  { key: 'q21' },
  { 
    key: 'q22' ,
    final: true,
    tokenType: TokenFamily.Data
  },
  { key: 'q23' },
  { key: 'q24' },
  { key: 'q25' },
  { 
    key:'q26', 
    final: true,
    tokenType: TokenFamily.MaiorIgual
  },
  { key:'q27' },
  { 
    key:'q28',  
    final: true,
    fromWedding: true,
    tokenType: TokenFamily.Maior
  },
  { key: 'q29'},
  { key: 'q30'},
  { 
    key: 'q31',
    final: true,
    fromWedding: true,
    tokenType: TokenFamily.Identificador
  },
  { key: 'q32' },
  { key: 'q33' },
  {
    key: 'q34',
    final: true,
    tokenType: TokenFamily.Comparacao
  },
  { key:'q35' },
  { 
    key:'q36',
    final: true,
    tokenType: TokenFamily.ComentarioLinha
  },
  { key: 'q37'},
  { key: 'q38'},
  { 
    key: 'q39',
    final: true,
    fromWedding: true,
    tokenType: TokenFamily.MenorIgual
  },
  { 
    key: 'q40',
    final: true,
    fromWedding: true,
    tokenType: TokenFamily.Menor
  },
  { key: 'q41'},
  { key: 'q42'},
  { key: 'q43'},
  { key: 'q44'},
  { 
    key: 'q45',
    final: true,
    tokenType: TokenFamily.ComentarioBloco
  },
  { 
    key: 'q46',
    final: true,
    tokenType: TokenFamily.Subtracao
  },
  { 
    key: 'q47',
    final: true,
    tokenType: TokenFamily.Soma
  },
  { 
    key: 'q48',
    final: true,
    tokenType: TokenFamily.LogicoNOT
  },
  { 
    key: 'q49',
    final: true,
    tokenType: TokenFamily.Multiplicacao
  },
  { 
    key: 'q50',
    final: true,
    tokenType: TokenFamily.Divisao
  },
  { 
    key: 'q51',
    final: true,
    tokenType: TokenFamily.LogicoAND
  },
  { 
    key: 'q52',
    final: true,
    tokenType: TokenFamily.LogicoOR
  },
  { 
    key: 'q53',
    final: true,
    tokenType: TokenFamily.Diferenca
  },
  { 
    key: 'q55',
    final: true,
    tokenType: TokenFamily.AbrirParen
  },
  { 
    key: 'q58',
    final: true,
    tokenType: TokenFamily.FecharParen
  },
  { 
    key: 'q59',
    final: true,
    tokenType: TokenFamily.DoisPontos
  },
  { 
    key: 'q54',
    final: true,
    tokenType: TokenFamily.Atribuicao
  },
  { key: 'q56'},
  { 
    key: 'q57',
    final: true,
    tokenType: TokenFamily.Cadeia
  },
  { key: 'q60'},
  { 
    key: 'keywords',
    final: true,
    fromWedding: true,
    tokenType: TokenFamily.Reservada
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
    'equals': 'q33',
    'less': 'q37',
    'greater': 'q27',
    'lowerletter':'q29',
    'hashtag': 'q35',
    'sub': 'q46',
    'sum': 'q47',
    'not': 'q48',
    'mult': 'q49',
    'div':'q50',
    'ampersand': 'q51',
    'pipe': 'q52',
    'quotes': 'q56',
    'dot' : 'q62',
    'openparen': 'q55',
    'closeparen': 'q58',
    'colon': 'q59',
  },
  'q1': {
    'digit':'q8',
    'dot':'q2',
    'x': 'q12',
    '!digit!dot!x': 'q11',
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
    'sub':'q5'
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
    'slash': 'q23',
    'dot': 'q2',
    'underscore': 'q15',
    '!digit!dot!slash': 'q11'
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
  'q12': {
    'hexsymbol':'q13'
  },
  'q13': {
    'hexsymbol':'q13',
    '!hexsymbol': 'q14'
  },
  'q14': {},
  'q15': {
    'digit': 'q16'
  },
  'q16': {
    'digit': 'q17'
  },
  'q17': {
    'underscore': 'q18'
  },
  'q18': {
    'digit': 'q19'
  },
  'q19': {
    'digit': 'q20'
  },
  'q20': {
    'digit': 'q21'
  },
  'q21': {
    'digit': 'q22'
  },
  'q22': {},
  'q23': {
    'digit': 'q24'
  },
  'q24': {
    'digit': 'q25'
  },
  'q25': {
    'slash': 'q18'
  },
  'q26': {},
  'q27': {
    'equals': 'q26',
    '!equals': 'q28'
  },
  'q28': {},
  'q29': {
    'lowerletter': 'q60',
    'upletter': 'q30',
  },
  'q30': {
    'lowerletter': 'q32',
    '!lowerletter!upletter': 'q31'
  },
  'q32': {
    'upletter': 'q30',
    '!lowerletter!upletter': 'q31'
  },
  'q33': {
    'equals': 'q34'
  },
  'q34': {},
  'q35': {
    'endl': 'q36',
    '!endl': 'q35'
  },
  'q36': {},
  'q37': {
    'equals': 'q38',
    '!less!greater!equals':'q40',
    'less': 'q41',
    'greater': 'q53',
  },
  'q38': {
    'equals': 'q54',
    '!equals': 'q39'
  },
  'q39': {},
  'q40': {},
  'q41': {
    'less': 'q42'
  },
  'q42': {
    '!greater': 'q42',
    'greater': 'q43'
  },
  'q43':{
    '!greater': 'q42',
    'greater': 'q44'
  },
  'q44': {
    '!greater': 'q42',
    'greater': 'q45'
  },
  'q45': {},
  'q46': {},
  'q47': {},
  'q48': {},
  'q49': {},
  'q50': {},
  'q51': {},
  'q52': {},
  'q55': {},
  'q56': {
    'quotes': 'q57',
    '!endl': 'q56'
  },
  'q57': {},
  'q58': {},
  'q59': {},
  'q60': {
    'lowerletter': 'q60',
    'underscore': 'q60',
    '!lowerletter!underscore': 'keywords',
  },
}

export { charType, states, table, keywords }