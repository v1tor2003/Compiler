import { TToken, TTransitionTable } from "./types"
import { Console } from "console" // para manipulacao do stdout
import { Transform } from "stream" // para manipular a stream de string na montagem da tabela
import * as ExcelJS from 'exceljs'  // biblioteca para transformar de obj para planilha a mesa de transicoes

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
/**
  * Funcao que formata o .table do console para remover a coluna padrao (index)
  * @param {any[]} input lista de objetos
  * @returns {void} manipula o stream no stdout, sem retorno
*/
function printAsTable(input: any[]): void{
  const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
  const logger = new Console({ stdout: ts })
  logger.table(input)
  const table = (ts.read() || '').toString()
  let result = '';
  for (let row of table.split(/[\r\n]+/)) {
    let r = row.replace(/[^┬]*┬/, '┌');
    r = r.replace(/^├─*┼/, '├');
    r = r.replace(/│[^│]*/, '');
    r = r.replace(/^└─*┴/, '└');
    r = r.replace(/'/g, ' ');
    result += `${r}\n`;
  }
  console.log(result);
}
/**
  * Funcao que salva a tabela de transicoes para o .xlsx (planilha)
  * @param {TTransitionTable} table mesa de transicoes do automato
  * @param {string} path caminho para o salvar o arquivo
  * @returns {Promise<void>} promessa vazia, pois o chamador deve esperar ela terminar para seguir
*/
async function saveAsExcelTransitionTable(table: TTransitionTable, path: string): Promise<void>{
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Transition Table')
  const states = Object.keys(table)
  let transitions = []
  
  for(const state in table){
    for(const transition in table[state]){
      if(transitions.indexOf(transition) === -1) transitions.push(transition)
    }
  }
    
  const header = worksheet.addRow(['s/t', ...transitions])

  states.forEach(state => {
    const row = worksheet.addRow([state, ...transitions.map(transition => table[state][transition] || ' ')])
  })

  try{
    await workbook.xlsx.writeFile(path)
    console.log(`Tabela de transicao salva em ${path}`)
  }catch(error){
    console.error('Erro ao salvar tabela de transicao', error)
  }

}

export {
  countTokenOccurrence,
  formatTokensAsTable,
  printAsTable,
  saveAsExcelTransitionTable
}