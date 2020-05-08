import { Vector } from './geometry.js'

class Agent {
  constructor(params) {
    this.x = params.x
    this.y = params.y
    this.radius = params.radius
    this.velocity = params.velocity || Vector.fromPolar(params.speed, params.direction)
    this.time = params.time || 0
  }

  step(Δt=1) {
    // Calculate the change in position based on how much time has ellapsed (dt)
    const Δx = this.velocity.x * Δt
    const Δy = this.velocity.y * Δt

    // Calculate new values for x and y
    const x = this.x + Δx
    const y = this.y + Δy

    // Calculate the new time
    const time = this.time + Δt

    return new Agent({
      ...this,
      x, y,
      time,
    })
  }

  bounce(bounceVector) {
    if (bounceVector.x === 0 && bounceVector.y === 0) {
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
