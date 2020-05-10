const π = Math.PI

class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  offset(vector) {
    if (vector.magnitude === 0) { return this }

    return new Point(
      this.x + vector.Δx,
      this.y + vector.Δy,
    )
  }
}

class Vector {
  constructor(Δx, Δy, magnitude=null, direction=null) {
    this.Δx = Δx
    this.Δy = Δy
    this._magnitude = magnitude
    this._direction = direction
  }

  static fromPolar(magnitude, direction) {
    return new Vector(
      Math.cos(direction) * magnitude,
      Math.sin(direction) * magnitude,
      magnitude,
      direction,
    )
  }

  get magnitude() {
    if (this._magnitude === null) {
      this._magnitude = (
        this.Δx === this.Δy === 0 ? 0 :
        Math.sqrt(this.Δx * this.Δx + this.Δy * this.Δy)
      )
    }
    return this._magnitude
  }

  get direction() {
    if (this._direction === null) {
      if (this.Δx === 0) {
        if (this.Δy > 0) { this._direction = π/2 }
        else         { this._direction = 3*π/2 }
      }

      this._direction = Math.atan(this.Δy / this.Δx)

      // arctan has a range between -90° and 90° (always pointing to the right).
      // When this.Δx is negative, we need to rotate the direction by 180°.
      if (this.Δx < 0) { this._direction += π }

      // Normalize the direction.
      while (this._direction < 0)    { this._direction += 2*π }
      while (this._direction >= 2*π) { this._direction -= 2*π }
    }
    return this._direction
  }

  get unit() {
    const magnitude = this.magnitude
    if (magnitude === 1) { return this }
    return new Vector(
      this.Δx / magnitude,
      this.Δy / magnitude,
      1,
      this._direction
    )
  }

  plus(other) {
    if (other.magnitude === 0) { return this }
    return new Vector(
      this.Δx + other.Δx,
      this.Δy + other.Δy,
    )
  }

  times(factor) {
    if (factor === 1) { return this }
    return new Vector(
      this.Δx * factor,
      this.Δy * factor,
      this._magnitude !== null ? this._magnitude * factor : null,
      this._direction
    )
  }

  dot(other) {
    return this.Δx * other.Δx + this.Δy * other.Δy
  }
}

class Segment {
  constructor(x1, y1, x2, y2, normal=null) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this._normal = normal
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