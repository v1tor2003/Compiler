import { Lexer } from "./lexer"
import { countTokenOccurrence, formatTokensAsTable } from "./utils"
import { TToken } from "./types"

// Script cliente para classe lexica
/**
  * @returns {Promise<void>} procedimento principal, sem retorno
*/
async function main(): Promise<void> {
  const lexer = new Lexer()
  const tokens: TToken[] = await lexer.tokenize('./input.cic')

  console.log('Analise de linhas no codigo fonte:')  
  console.log(lexer.getSourceCodeErrors())

  console.log('Lista de tokens reconhecidos:')  
  console.table(formatTokensAsTable(tokens))
  
  console.log('Lista de uso dos tokens:')
  console.table(
    countTokenOccurrence(tokens)
    .sort((a, b) => b.count - a.count)
    .map(({tk, count}) => ({ TOKEN: tk, USOS: count }))
  )
  
  
  // gonna save to a excel file for better readbility
  //formatTransiontionTable(table)
}

main()
  .then(() => {process.exit(0)})
  .catch((e: unknown) => {
    console.log(e)
    process.exit(1)
  })