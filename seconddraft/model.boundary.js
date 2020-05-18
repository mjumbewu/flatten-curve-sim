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
    const x1 = this.segment.p1.x
    const y1 = this.segment.p1.y
    const x2 = this.segment.p2.x
    const y2 = this.segment.p2.y

    const orthogonal = new Vector(
      y2 - y1,
      x1 - x2,
    )
    return orthogonal.unit
  }
}

export { Boundary }
