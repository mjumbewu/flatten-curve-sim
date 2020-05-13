import { toPrecision } from './utils.js'
const π = Math.PI
const abs = Math.abs

// Floating point math is, literally, the devil. So, let's use a threshold
// of 5 decimal places for all of our numbers, for the sake of our sanity.
function lte(a, b, t=0.000001) { return (a <= b + t) || (a <= b - t) }
function gte(a, b, t=0.000001) { return (a >= b + t) || (a >= b - t) }

function lte3(a, b, c) { return lte(a, b) && lte(b, c) }
function gte3(a, b, c) { return gte(a, b) && gte(b, c) }

class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  offset(vector) {
    if (vector.iszero) { return this }

    return new Point(
      this.x + vector.Δx,
      this.y + vector.Δy,
    )
  }
}

class Vector {
  constructor(Δx, Δy) {
    this.Δx = Δx
    this.Δy = Δy
  }

  static fromPolar(magnitude, direction) {
    return new Vector(
      Math.cos(direction) * magnitude,
      Math.sin(direction) * magnitude,
    )
  }

  get iszero() {
    return this.Δx === 0 && this.Δy === 0
  }

  get magnitude() {
    return this.iszero ? 0 : Math.sqrt(this.Δx * this.Δx + this.Δy * this.Δy)
  }

  get direction() {
    if (this.Δx === 0) {
      return this.Δy > 0 ? π/2 : 3*π/2
    }

    let direction = Math.atan(this.Δy / this.Δx)

    // arctan has a range between -90° and 90° (always pointing to the right).
    // When this.Δx is negative, we need to rotate the direction by 180°.
    if (this.Δx < 0) { direction += π }

    // Normalize the direction.
    while (direction < 0)    { direction += 2*π }
    while (direction >= 2*π) { direction -= 2*π }

    return direction
  }

  get unit() {
    const magnitude = this.magnitude
    if (magnitude === 1) { return this }
    return new Vector(
      this.Δx / magnitude,
      this.Δy / magnitude,
    )
  }

  plus(other) {
    if (this.iszero) { return other }
    if (other.iszero) { return this }
    return new Vector(
      this.Δx + other.Δx,
      this.Δy + other.Δy,
    )
  }

  minus(other) {
    if (other.iszero) { return this }
    return new Vector(
      this.Δx - other.Δx,
      this.Δy - other.Δy,
    )
  }

  times(factor) {
    if (factor === 1) { return this }
    return new Vector(
      this.Δx * factor,
      this.Δy * factor,
    )
  }

  dot(other) {
    return this.Δx * other.Δx + this.Δy * other.Δy
  }
}

class Segment {
  constructor(p1, p2) {
    this.p1 = p1
    this.p2 = p2
    this._normal = null
  }

  static fromCoords(x1, y1, x2, y2) {
    return new Segment(
      new Point(x1, y1),
      new Point(x2, y2),
    )
  }

  get x1() { return this.p1.x }
  get y1() { return this.p1.y }
  get x2() { return this.p2.x }
  get y2() { return this.p2.y }

  offset(vector) {
    if (vector.iszero) { return this }

    return new Segment(
      this.p1.offset(vector),
      this.p2.offset(vector),
    )
  }

  get normal() {
    if (this._normal === null) {
      const orthogonal = new Vector(
        this.y2 - this.y1,
        this.x1 - this.x2,
      )
      this._normal = orthogonal.unit
    }
    return this._normal
  }

  get slopeintercept() {
    const x1 = this.p1.x
    const y1 = this.p1.y
    const x2 = this.p2.x
    const y2 = this.p2.y

    const m = (y2 - y1) / (x2 - x1)
    const b = isFinite(m) ? y1 - m * x1 : null
    return [m, b]
  }

  contains(point, shortcut=false) {
    const x1 = this.p1.x
    const y1 = this.p1.y
    const x2 = this.p2.x
    const y2 = this.p2.y

    const {x, y} = point

    if (!shortcut) {
      const [m, b] = this.slopeintercept
      if (b === null && x !== x1) { return false }
      if (b !== null && y !== m * x + b) { return false}
    }

    return (
      ( lte3(x1, x, x2) || gte3(x1, x, x2) ) &&
      ( lte3(y1, y, y2) || gte3(y1, y, y2) )
    )
  }

  crosses(other) {
    const s1 = this
    const s2 = other

    // Calculate the slopes. If they have the same slopes then they never
    // intersect. The one time that two segments might have the same slope but
    // still be parallel is if one is Infinity and the other is -Infinity, but
    // in that case both intercepts will be null.
    const [m1, b1] = s1.slopeintercept
    const [m2, b2] = s2.slopeintercept
    if (m1 === m2) { return null }
    if (b1 === null && b2 === null) { return null }

    // Calculate the intersection point (where y == m1 * x + b1 == m2 * x + b2).
    // Bear in mind in the code below that a null intercept implies a vertical
    // line with an infinite slope.
    const x = ( b1 === null ? s1.p1.x : ( b2 === null ? s2.p1.x : (b2 - b1) / (m1 - m2) ) )
    const y = ( b1 === null ? m2 * x + b2 : m1 * x + b1 )
    const i = new Point(x, y)

    // If and only if the intersection point is on both segments, it is valid
    if (s1.contains(i, true) && s2.contains(i, true)) { return i }
    else { return null }
  }
}

export { Point, Segment, Vector }