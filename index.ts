import { Lexer } from "./lexer"

// Script cliente para classe Lexer
/**
   * @returns {Promise<void>} procedimento principal, sem retorno
*/
async function main(): Promise<void> {
  const lexer = new Lexer()
  const tokens = await lexer.tokenize('./input.txt')
  console.log(tokens)
}

main()
  .then(() => {process.exit(0)})
  .catch((e: unknown) => {
    console.log(e)
    process.exit(1)
  })