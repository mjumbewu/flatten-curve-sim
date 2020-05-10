const π = Math.PI

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
  constructor(x1, y1, x2, y2) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this._normal = null
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

  get slope() {
    return 1.0 * (this.y2 - this.y1) / (this.x2 - this.x1)
  }
}

export { Point, Segment, Vector }