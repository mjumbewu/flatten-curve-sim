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
    const Δp = this.velocity .times (Δt)

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

  bounce(force) {
    // vf = v - 2 (v • f / |f|) f
    //
    // f is the vector in which the sum of forces is being applied
    // v is the current directional vector (i.e., the velocity)
    // vf (or xf - x0) is the after-bounce directional vector

    const f = force
    const v = this.velocity

    // If the magnitude of the bounce vector is 0 then do nothing
    if (f.iszero) { return this }

    // Get the dot product of v and n.
    const dp = f.dot(v)

    // If the dot product is positive, then the agent is travelling in the same
    // direction as the normal vector and we should not bounce.
    if (dp >= 0) { return this }

    // Calculate the final velocity vector
    const vf = v .minus (f .times (2 * dp / f.magnitude) )

    return new Agent({
      ...this,
      velocity: vf
    })
  }
}

export { Agent }
