import { Segment, Vector } from './geometry.js'

class Boundary {
  constructor(params) {
    this.segment = Segment.fromCoords(
      params.x1,
      params.y1,
      params.x2,
      params.y2,
    )
    this._normal = null
  }

  get x1() { return this.segment.x1 }
  get y1() { return this.segment.y1 }
  get x2() { return this.segment.x2 }
  get y2() { return this.segment.y2 }

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
}

export { Boundary }
