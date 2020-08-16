import { Point, Vector } from './geometry.js'
import { Infection } from './model.infection.js'

const ZERO_VECTOR = new Vector(0, 0)

class Agent {
  constructor(params) {
    this.position = params.position || new Point(params.x, params.y)
    this.radius = params.radius
    this.velocity = params.velocity || Vector.fromPolar(params.speed, params.direction)
    this.time = params.time || 0

    this.vulnerability = params.vulnerability || 1
    this.infection = params.infection || new Infection({
      infectedtime: params.infectedtime,
      asymptomaticdur: params.asymptomaticdur,
      symptomaticdur: params.symptomaticdur,
      infectiousness: params.infectiousness,
    })
    this.deceased = params.deceased || false
  }

  infect(infectionparams) {
    const infection = new Infection({
      ...infectionparams,
      infectedtime: this.time,
    })

    return new Agent({
      ...this,
      infection
    })
  }

  get x() { return this.position.x }
  get y() { return this.position.y }
  get health() {
    if (this.infection === null || t < this.infection.infectedtime) {
      return 'uninfected'
    } else if (t < t.infection.symptomatictime) {
      return 'infected'
    } else if (t < t.infection.resolvedtime) {
      return 'symptomatic'
    } else {
      return 'recovered'
    }
return this.isdeceased ? 'deceased' : this.infection.healthAtTime(this.time) }

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

  bounce(normals) {
    if (normals.length === 0) { return this }

    // Get the initial velocity vector
    const v = this.velocity

    // Construct an effective normal by projecting the velocity onto each of
    // the collision normals, and then negating the resulting impact vectors.
    // Think of this as a form of Newton's third law of motion -- every action
    // has an equal and opposite reaction.
    const n = normals
      .map(n => v.projected(n))
      .reduce((i1, i2) => i1 .minus (i2), ZERO_VECTOR)

    if (n.iszero) { return this }

    // The effective normal gives us the direction of impact on the agent. The
    // agent's final velocity should have the same magnitude as the initial
    // velocity -- think of this as a kind of conservation of momentum.
    const i = v.projected(n) .times (-2)

    // Calculate the new velocity vector
    const velocity = v .plus (i)

    return new Agent({
      ...this,
      velocity
    })
  }
}

export { Agent }
