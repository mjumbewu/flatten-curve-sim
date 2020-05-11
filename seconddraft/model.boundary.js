import { Segment, Vector } from './geometry.js'

class Boundary {
  constructor(params) {
    this.segment = Segment.fromCoords(
      params.x1,
      params.y1,
      params.x2,
      params.y2,
    )
  }

  get x1() { return this.segment.x1 }
  get y1() { return this.segment.y1 }
  get x2() { return this.segment.x2 }
  get y2() { return this.segment.y2 }

  get normal() { return this.segment.normal }
}

Boundary.prototype.isCrossedBy = function(otherSegment) {
  return this.segment.crosses(otherSegment)
}

export { Boundary }
