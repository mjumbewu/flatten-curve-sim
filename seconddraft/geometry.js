const π = Math.PI

class Vector {
  constructor(x, y, magnitude=null, direction=null) {
    this.x = x
    this.y = y
    this._magnitude = magnitude
    this._direction = direction
  }

  get magnitude() {
    if (this._magnitude === null) {
      this._magnitude = Math.sqrt(this.x * this.x + this.y * this.y)
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
    return new Vector(
      this.x / magnitude,
      this.y / magnitude,
      1,
      this._direction
    )
  }

  plus(other) {
    if (other) {
      return new Vector(
        this.x + other.x,
        this.y + other.y,
      )
    }
  }

  times(factor) {
    if (factor !== undefined) {
      return new Vector(
        this.x * factor,
        this.y * factor,
        this._magnitude !== null ? this._magnitude * factor : null,
        this._direction
      )
    }
  }

  dot(other) {
    return this.x * other.x + this.y * other.y
  }
}

Vector.fromPolar = function(magnitude, direction) {
  return new Vector(
    Math.cos(direction) * magnitude,
    Math.sin(direction) * magnitude,
    magnitude,
    direction,
  )
}

class Segment {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
  }

  get normal() {
    const orthogonal = new Vector(
      this.y2 - this.y1,
      this.x1 - this.x2,
    )
    return orthogonal.unit
  }

  get slope() {
    return 1.0 * (this.y2 - this.y1) / (this.x2 - this.x1)
  }
}

export { Point, Segment, Vector }