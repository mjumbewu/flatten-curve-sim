import { Point, Vector } from './geometry.js'

class Agent {
  constructor(params) {
    this.position = params.position || new Point(params.x, params.y)
    this.radius = params.radius
    this.velocity = params.velocity || Vector.fromPolar(params.speed, params.direction)
    this.time = params.time || 0
  }

  get x() { return this.position.x }
  get y() { return this.position.y }

  step(Δt=1) {
    // Calculate the change in position based on how much time has ellapsed (dt)
    const Δp = this.velocity.times(Δt)

    // Calculate new position
    const position = this.position.offset(Δp)

    // Calculate the new time
    const time = this.time + Δt

    return new Agent({
      ...this,
      position,
      time,
    })
  }

  bounce(bounceVector) {
    if (bounceVector.magnitude === 0) {
      return this
    }

    // vf = v - 2 (v • n) n
    //
    // v is the current directional vector
    // vf (or xf - x0) is the after-bounce directional vector

    // We want the normal vector to have a magnitude of 1, so let's "normalize" it.
    const n = bounceVector.unit
    const v = this.velocity

    // Get the dot product of v and n. If the dot product is positive, then the
    // agent is travelling in the same direction as the normal vector and we should
    // not bounce.
    const dp = n.dot(v)
    if (dp >= 0) { return this }

    const vf = v.plus(n.times(-2 * dp))

    return new Agent({
      ...this,
      velocity: vf
    })
  }
}

export { Agent }
