import { 
  TCharTypeMapping, 
  TKeyword, 
  TState, 
  TTransitionTable, 
  TokenFamily 
} from "./types"
// Palavras reservadas da linguagem definidas nas intrucoes do classroom
const keywords: TKeyword[] = [
  { tokenType: TokenFamily.TK_ROTINA, value: 'rotina' },
  { tokenType: TokenFamily.TK_FIM_ROTINA, value: 'fim_rotina' },
  { tokenType: TokenFamily.TK_SE, value: 'se' },
  { tokenType: TokenFamily.TK_SENAO, value: 'senao' },
  { tokenType: TokenFamily.TK_IMPRIMA, value: 'imprima' },
  { tokenType: TokenFamily.TK_LEIA, value: 'leia' },
  { tokenType: TokenFamily.TK_PARA, value: 'para' },
  { tokenType: TokenFamily.TK_ENQUANTO, value: 'enquanto' },
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
  { regex: /[^_]/, type: '!underscore'},
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
  { regex: /[^/]/, type: '!slash'},
  { regex: /\(/, type: 'openparen'},
  { regex: /\)/, type: 'closeparen'},
  { regex: /\$/, type: '$'},
  { regex: /\:/, type: 'colon'},
  { regex: /[A-Z]/, type: 'upletter'},
  { regex: /[a-z]/, type: 'lowerletter'},
  { regex: /[0-9A-F]/, type: 'hexsymbol'},
  { regex: /[^0-9A-F]/, type: '!hexsymbol'},
  { regex: /[^>]/, type: '!greater'},
  { regex: /[^>$]/, type: '!greater!$'},
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
    pathHadWedding: true,
    tokenType: TokenFamily.TK_FLOAT
  },
  { key: 'q7' },
  { key: 'q8' },
  { key: 'q9' },
  { key: 'q10' },
  {
    key: 'q11',
    final: true,
    pathHadWedding: true,
    tokenType: TokenFamily.TK_INT
  },
  { key: 'q12' },
  { key: 'q13' },
  { 
    key: 'q14',
    final: true,
    pathHadWedding: true,
    tokenType: TokenFamily.TK_END
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
    tokenType: TokenFamily.TK_DATA
  },
  { key: 'q23' },
  { key: 'q24' },
  { key: 'q25' },
  { 
    key:'q26', 
    final: true,
    tokenType: TokenFamily.TK_MAIOR_IGUAL
  },
  { key:'q27' },
  { 
    key:'q28',  
    final: true,
    pathHadWedding: true,
    tokenType: TokenFamily.TK_MAIOR
  },
  { key: 'q29'},
  { key: 'q30'},
  { 
    key: 'q31',
    final: true,
    pathHadWedding: true,
    tokenType: TokenFamily.TK_ID
  },
  { key: 'q32' },
  { key: 'q33' },
  {
    key: 'q34',
    final: true,
    tokenType: TokenFamily.TK_COMP
  },
  { key:'q35' },
  { 
    key:'q36',
    final: true,
  },
  { key: 'q37'},
  { key: 'q38'},
  { 
    key: 'q39',
    final: true,
    pathHadWedding: true,
    tokenType: TokenFamily.TK_MENOR_IGUAL
  },
  { 
    key: 'q40',
    final: true,
    pathHadWedding: true,
    tokenType: TokenFamily.TK_MENOR
  },
  { key: 'q41'},
  { key: 'q42'},
  { key: 'q43'},
  { key: 'q44'},
  { 
    key: 'q45',
    final: true,
  },
  { 
    key: 'q46',
    final: true,
    tokenType: TokenFamily.TK_MENOS
  },
  { 
    key: 'q47',
    final: true,
    tokenType: TokenFamily.TK_MAIS
  },
  { 
    key: 'q48',
    final: true,
    tokenType: TokenFamily.TK_NOT
  },
  { 
    key: 'q49',
    final: true,
    tokenType: TokenFamily.TK_MULT
  },
  { 
    key: 'q50',
    final: true,
    tokenType: TokenFamily.TK_DIV
  },
  { 
    key: 'q51',
    final: true,
    tokenType: TokenFamily.TK_AND
  },
  { 
    key: 'q52',
    final: true,
    tokenType: TokenFamily.TK_OR
  },
  { 
    key: 'q53',
    final: true,
    tokenType: TokenFamily.TK_DIF
  },
  { 
    key: 'q54',
    final: true,
    tokenType: TokenFamily.TK_ATRIB
  },
  { 
    key: 'q55',
    final: true,
    tokenType: TokenFamily.TK_ABRE_PAR
  },
  { key: 'q56'},
  { 
    key: 'q57',
    final: true,
    tokenType: TokenFamily.TK_CADEIA
  },
  { 
    key: 'q58',
    final: true,
    tokenType: TokenFamily.TK_FECHA_PAR
  },
  { 
    key: 'q59',
    final: true,
    tokenType: TokenFamily.TK_DOIS_PONTOS
  },
  { key: 'q60'},
  { 
    key: 'q61',
    final: true,
    pathHadWedding: true,
    tokenType: TokenFamily.TK_RESERVADA
  },
  { key: 'q62'},
  { 
    key: 'q63',
    final: true,
    err: {
      err_str: true,
      msg: 'Cadeia nao fechada.'
    }
  },
  { 
    key: 'q64',
    final: true,
    err: {
      msg: 'Data mal formada.'
    }
  },
  { 
    key: 'q65',
    final: true,
    err: {
      msg: 'Idenficador mal formado.'
    }
  },
  { 
    key: 'q66',
    final: true,
    err: {
      msg: 'Bloco de comentario nao concluido.'
    }
  },
  {  key: 'q67' }
]

// Transicoes para aceitacao dos tokens
// a mesa é um objeto onde cada chave eh um estado com suas possiveis transicoes e
// respectivos destinos, (o estado de rejeicao é uma estado de chave vazia, ele eh atigido quando nao existir
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
    'hexsymbol': 'q67'
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
    'underscore': 'q18',
    '!underscore': 'q64'
  },
  'q18': {
    'digit': 'q19',
    '!digit': 'q64'
  },
  'q19': {
    'digit': 'q20',
    '!digit': 'q64'
  },
  'q20': {
    'digit': 'q21',
    '!digit': 'q64'
  },
  'q21': {
    'digit': 'q22',
    '!digit': 'q64'
  },
  'q22': {},
  'q23': {
    'digit': 'q24'
  },
  'q24': {
    'digit': 'q25'
  },
  'q25': {
    'slash': 'q18',
    '!slash': 'q64'
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
    '!lowerletter!upletter': 'q65'
  },
  'q30': {
    'lowerletter': 'q32',
    'upletter': 'q65',
    '!lowerletter!upletter': 'q31'
  },
  'q31': {},
  'q32': {
    'lowerletter': 'q65',
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
    '!greater!$': 'q42',
    'greater': 'q43',
    '$': 'q66'
  },
  'q43':{
    '!greater!$': 'q42',
    'greater': 'q44',
    '$': 'q66'
  },
  'q44': {
    '!greater!$': 'q42',
    'greater': 'q45',
    '$': 'q66'
  },
  'q45': {},
  'q46': {},
  'q47': {},
  'q48': {},
  'q49': {},
  'q50': {},
  'q51': {},
  'q52': {},
  'q53': {},
  'q54': {},
  'q55': {},
  'q56': {
    'quotes': 'q57',
    'endl': 'q63',
    '!endl': 'q56'
  },
  'q57': {},
  'q58': {},
  'q59': {},
  'q60': {
    'lowerletter': 'q60',
    'underscore': 'q60',
    '!lowerletter!underscore': 'q61',
  },
  'q61': {},
  'q62': {
    'digit': 'q2'
  },
  'q63': {},
  'q64': {},
  'q65': {},
  'q66': {},
  'q67': {
    'x': 'q12',
  },
}

export { charType, states, table, keywords }