import { TCharTypeMapping } from "./types"

const charType: TCharTypeMapping[] = [
  { regex: /[0-9]/, type: 'digit' },
  { regex: /^\./, type: 'dot'},
  { regex: /\e/, type: 'e' },
  { regex: /\-/, type: 'hifen' },
  { regex: /^[^\d.]$/, type: '!digit!dot'},
  { regex: /[^0-9]/, type: '!digit'}
]

function getSymbolType(char: string): string[]{
  let types: string[] = []
  for (const { regex, type } of charType)
    if (regex.test(char)) types.push(type)
    

  return types
}


const chars = ['1', '2', '3', '.']
chars.forEach((c) => console.log(getSymbolType(c)))
