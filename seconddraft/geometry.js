const π = Math.PI

class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  offset(vector) {
    if (vector.magnitude === 0) { return this }

    return new Point(
      this.x + vector.x,
      this.y + vector.y,
    )
  }
}

class Vector {
  constructor(x, y, magnitude=null, direction=null) {
    this.x = x
    this.y = y
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
        this.x === this.y === 0 ? 0 :
        Math.sqrt(this.x * this.x + this.y * this.y)
      )
    }
    return this._magnitude
  }

  get direction() {
    if (this._direction === null) {
      if (this.x === 0) {
        if (this.y > 0) { this._direction = π/2 }
        else         { this._direction = 3*π/2 }
      }

      this._direction = Math.atan(this.y / this.x)

      // arctan has a range between -90° and 90° (always pointing to the right).
      // When this.x is negative, we need to rotate the direction by 180°.
      if (this.x < 0) { this._direction += π }

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
      this.x / magnitude,
      this.y / magnitude,
      1,
      this._direction
    )
  }

  plus(other) {
    if (other.magnitude === 0) { return this }
    return new Vector(
      this.x + other.x,
      this.y + other.y,
    )
  }

  times(factor) {
    if (factor === 1) { return this }
    return new Vector(
      this.x * factor,
      this.y * factor,
      this._magnitude !== null ? this._magnitude * factor : null,
      this._direction
    )
  }

  dot(other) {
    return this.x * other.x + this.y * other.y
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