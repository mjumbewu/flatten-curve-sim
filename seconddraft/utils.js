function* zipLongest(array1, array2) {
  const maxLength = Math.max(array1.length, array2.length)
  for (let i = 0; i < maxLength; ++i) {
    yield [array1[i], array2[i]]
  }
}

export { zipLongest }