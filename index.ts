import { Lexer } from "./lexer"
import { TToken } from "./types"

// Script cliente para classe lexica
/**
  * @returns {Promise<void>} procedimento principal, sem retorno
*/
async function main(): Promise<void> {
  const lexer = new Lexer()
  const tokens = await lexer.tokenize('./input.cic')
  console.log(lexer.getSourceCodeErrors())
  console.log('List of recognized tokens:')
  console.log(tokens)
  const { floatCount, integerCount} = countFloatsAndIntegers(tokens)
  console.log('Total of Integer Tokens:', integerCount)
  console.log('Total of FLoat Tokens:', floatCount)
}
/**
  * Funcao que conta a ocorrencia de tokens Inteiros e Float
  * @param {TToken[]} tokens lista de tokens gerados pelo lexer
  * @returns {floatCount: number, integerCount: number} soma individual de tokens float e int 
*/
function countFloatsAndIntegers (tokens: TToken[]):{
  floatCount: number,
  integerCount: number
} {
  let floatCount: number = 0;
  let integerCount: number = 0;

  tokens.forEach(token => {
    if (token.tokenKind === 'Float') 
      floatCount++
    else if (token.tokenKind === 'Integer') 
      integerCount++
  })

  return { floatCount, integerCount }
}

main()
  .then(() => {process.exit(0)})
  .catch((e: unknown) => {
    console.log(e)
    process.exit(1)
  })