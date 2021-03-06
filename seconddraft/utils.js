function* zipLongest(array1, array2) {
  const maxLength = Math.max(array1.length, array2.length)
  for (let i = 0; i < maxLength; ++i) {
    yield [array1[i], array2[i]]
  }
}

// Floating point math is, literally, the devil. So, let's use a threshold
// of 5 decimal places for all of our numbers, for the sake of our sanity.
function eq(a, b, t=0.000001) { return (b - t <= a && a <= b + t) }
function lte(a, b, t=0.000001) { return (a <= b + t) }
function gte(a, b, t=0.000001) { return (a >= b - t) }

// Sometimes we want to choose a minimal value from an array using some key
// function.
function minimal(values, keyfunc) {
  let minval = null
  let minkey = null

  for (const val of values) {
    const key = keyfunc(val)
    if (minkey === null || key < minkey) {
      minkey = key
      minval = val
    }
  }
  return minval
}

export { eq, lte, gte, minimal, zipLongest }