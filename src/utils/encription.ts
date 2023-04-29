import bigInt, { BigInteger } from 'big-integer'

function stringToDecimal(input: string, index: number): string {
  return input.charCodeAt(index).toString().padStart(4, '0')
}

function decimalToString(input: number): string {
  return String.fromCharCode(input)
}

function Shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function Hash(secret: string): BigInteger {
  let output = '1'
  for (let i = 0; i < secret.length; i++) {
    output += stringToDecimal(secret, i)
  }
  return bigInt(output)
}

function HashWord(word: string, hash: BigInteger): string {
  let decimalWord = '1'
  for (let i = 0; i < word.length; i++) {
    decimalWord += stringToDecimal(word, i)
  }
  const hashedDecimal = bigInt(decimalWord).add(hash)
  return hashedDecimal.toString().replace(/\D/g, '')
}

function UnHashWord(word: string, hash: BigInteger): string {
  const hashedDecimal = bigInt(word)
  const subtractedSecret = hashedDecimal.subtract(hash)
  const characters = subtractedSecret.toString().replace(/\D/g, '').substring(1).match(/.{1,4}/g)
  const unhashedWord = characters?.map(char => decimalToString(parseInt(char))).join('')
  return unhashedWord || ''
}

export function Encode(input: string, secret: string): string {
  const secretHash = Hash(secret)
  const words = input.split(' ')
  const hashedWords: string[] = []
  for (let i = 0; i < words.length; i++) {
    hashedWords.push(`${i.toString().padStart(4, '0')}${HashWord(words[i], secretHash)}`)
  }
  return Shuffle(hashedWords).join(' ')
}

export function Decode(input: string, secret: string): string {
  const secretHash = Hash(secret)
  const hashedWords = input.split(' ')
  const result = Array(hashedWords.length).fill('0')
  for (let i = 0; i < hashedWords.length; i++) {
    const pos = parseInt(hashedWords[i].substring(0, 4))
    const hashedWord = hashedWords[i].substring(4)
    result[pos] = UnHashWord(hashedWord, secretHash)
  }

  return result.join(' ')
}
