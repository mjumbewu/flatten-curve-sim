import { Segment, Vector } from './geometry.js'
let abs = Math.abs

class Boundary {
  constructor(params) {
    this.segment = new Segment(
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
  const s1 = this.segment
  const s2 = otherSegment

  // Calculate the slopes. If they have the same slopes then they never
  // intersect. The one time that two segments might have the same slope but
  // still be parallel is if one is Infinity and the other is -Infinity.
  const m1 = s1.slope
  const m2 = s2.slope
  if (m1 === m2) { return false }
  if (abs(m1) === Infinity && abs(m2) === Infinity) { return false }

  // Calculate the intercepts
  const b1 = s1.y1 - m1 * s1.x1
  const b2 = s2.y1 - m2 * s2.x1

  // Calculate the intersection point. An infinite slope implies a vertical
  // line.
  const xi = ( !isFinite(m1) ? s1.x1 : ( !isFinite(m2) ? s2.x1 : (b2 - b1) / (m1 - m2) ) )
  const yi = ( !isFinite(m1) ? m2 * xi + b2 : m1 * xi + b1 )

  // Exclude the starting point of the segment from consideration
  if (s2.x1 === xi && s2.y1 === yi) { return false }

  // Determine whether the intersection point is on both segments
  const intersects = (
    ( (s1.x1 <= xi && xi <= s1.x2) || (s1.x1 >= xi && xi >= s1.x2) ) &&
    ( (s1.y1 <= yi && yi <= s1.y2) || (s1.y1 >= yi && yi >= s1.y2) ) &&
    ( (s2.x1 <= xi && xi <= s2.x2) || (s2.x1 >= xi && xi >= s2.x2) ) &&
    ( (s2.y1 <= yi && yi <= s2.y2) || (s2.y1 >= yi && yi >= s2.y2) )
  )

  return intersects
}

export { Boundary }
