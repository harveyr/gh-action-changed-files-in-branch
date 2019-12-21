function main() {
  const inputA = process.env.INPUT_A
  const inputB = process.env.INPUT_B

  const arrays = [inputA, inputB].map(s => {
    return s.split(' ')
  })

  console.log('Arrays:\n- %s\n- %s', inputA, inputB)

  if (arrays[0].length !== arrays[1].length) {
    throw new Error(
      `Lengths not equal: ${arrays[0].length} !== ${arrays[1].length}`,
    )
  }

  for (let i = 0; i < arrays[0].length; i++) {
    const a = arrays[0][i]
    const b = arrays[1][i]
    if (a !== b) {
      throw new Error(`Index ${i}: ${a} !== ${b}`)
    }
  }
}

if (require.main === module) {
  main()
}
