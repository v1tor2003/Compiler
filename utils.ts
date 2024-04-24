import { TToken, TTransitionTable } from "./types"

/**
  * Funcao que conta a ocorrencia de tokens
  * @param {TToken[]} tokens lista de tokens gerados pelo lexer
  * @returns {{tk: string, count: number}[]} lista com os tokens e seus respectivos usos
*/
function countTokenOccurrence (tokens: TToken[]): { tk: string, count: number}[] {
  const ocurrences: { [key: string]: number } = {}

  for(const token of tokens)
    if(ocurrences[token.tokenKind])
      ocurrences[token.tokenKind]++
    else 
     ocurrences[token.tokenKind] = 1

  const result = []

  for (const [tokenKind, count] of Object.entries(ocurrences))
    result.push({tk: tokenKind, count: count})

  return result
}

/**
  * Funcao que formata para uma tabela os dados sobre os tokens reconhecidos
  * @param {TToken[]} tokens lista de tokens
  * @returns {{LIN: number | string, COL: number, TOKEN: string, LEXEMA: string}[]} lista do objeto que representa uma tabela de tokens
*/
function formatTokensAsTable(tokens: TToken[]): {
  LIN: number | string;
  COL: number;
  TOKEN: string;
  LEXEMA: string | null;
}[] {
  let prevLineId: number | string = 0
  return tokens.map(({col, lin, tokenKind, lexeme}) => 
    {
      let lineId: number | string = lin
      if(lin === prevLineId) lineId = ''
      else prevLineId = lin

      return {
        LIN: lineId,
        COL: col,
        TOKEN: tokenKind,
        LEXEMA: lexeme ? lexeme : ''
      }
    })
}

// IN PROGRESS
function formatTransiontionTable(table: TTransitionTable): string {
   // Get all the states and symbols(transitions) with no duplications
  const states = Object.keys(table)
  let symbols = [];
  for (const state in table) {
    for (const symbol in table[state]) {
      if (symbols.indexOf(symbol) === -1) {
        symbols.push(symbol);
      }
    }
  }
  // header
  let tableStr = ' '.padEnd(5) + symbols.map(symbol => symbol.padEnd(12)).join('');
 
  for (const state of states) {
    // add state to line
    tableStr += '\n' + state.padEnd(4) + ' '
 
    // Set resultState on table for state(trasition) => resultState
    // If there is no resultState we set - in the table
    for (const symbol of symbols) {
      const nextState = table[state][symbol] || '-'
      tableStr += nextState.padEnd(12)
    }
   }
 
  return tableStr
}

export {
  formatTransiontionTable,
  countTokenOccurrence,
  formatTokensAsTable
}