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

  bounce(effectiveNormal) {
    const n = effectiveNormal
    const v = this.velocity

    // The effectiveNormal gives us the direction of impact on the agent. The
    // agent's final velocity should have the same magnitude as the initial
    // velocity -- think of this as conservation of momentum.
    const i = v .projected (n) .times (-2)

    // Calculate the new velocity vector
    const velocity = v .plus (i)

    return new Agent({
      ...this,
      velocity
    })
  }
}

export { Agent }
