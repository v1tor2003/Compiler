import { Lexer } from "./lexer"
import { countTokenOccurrence, formatTokensAsTable, printAsTable, saveAsExcelTransitionTable } from "./utils"
import { TToken } from "./types"
import { table } from "./constants"

// Script cliente para classe lexica
/**
  * @returns {Promise<void>} procedimento principal, sem retorno
*/
async function main(): Promise<void> {
  const lexer = new Lexer()
  const input: string = process.argv.slice(2)[0]
  if(!input) throw new Error('Nenhum arquivo de entrada informado.')

  const tokens: TToken[] = await lexer.tokenize(input)

  console.log('Analise de linhas no codigo fonte:')  
  console.log(lexer.getSourceCodeErrors())

  console.log('Lista de tokens reconhecidos:')  
  printAsTable(formatTokensAsTable(tokens))
  // Lista de uso ordenada por ordem decrescente
  console.log('Lista de uso dos tokens:')
  printAsTable(
    countTokenOccurrence(tokens)
    .sort((a, b) => b.count - a.count)
    .map(({tk, count}) => ({ TOKEN: tk, USOS: count }))
  )
  // salva tabela de transicao para um arquivo .xlsx
  // se o arquivo nao existir ele eh criado, se nao eh substituido
  await saveAsExcelTransitionTable(table, 'transition_table.xlsx')
}

main()
  .then(() => {process.exit(0)})
  .catch((e: unknown) => {
    console.log(e)
    process.exit(1)
  })