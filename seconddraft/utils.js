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

export { eq, lte, gte, zipLongest }