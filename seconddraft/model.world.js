import { Segment, Vector } from './geometry.js'
import { zipLongest } from './utils.js'

class World {
  constructor(params) {
    this.agents = params.agents || []
    this.boundaries = params.boundaries || []
    this.time = params.time || 0
  }

  step(Δt=1) {
    const zero = new Vector(0, 0)

    let bounceIfCollided = (oldAgent, newAgent) => {
      const path = new Segment(oldAgent.position, newAgent.position)
      const radius = newAgent.radius

      let force = zero
      for (const boundary of this.boundaries) {
        // First we figure out which side of the boundary the original agent
        // center was on. There is a good explanation of why the following does
        // that at https://math.stackexchange.com/a/274728/783341.
        const side = ((oldAgent.x - boundary.x1) * (boundary.y2 - boundary.y1) -
                      (oldAgent.y - boundary.y1) * (boundary.x2 - boundary.x1)) >= 0 ? 1 : -1

        // We use that side to determine the correct orientation for our normal
        // (because it matters if it's pointing toward the agent or away from
        // it).
        const normal = boundary.normal .times (side)

        // Then we determine a threshold of how near the agent should be able
        // to get to the boundary before we consider it a collision. We use the
        // agent's radius to determine how far offset from the boundary the
        // threshold should be.
        const threshold = boundary.segment.offset(normal .times (radius))

        // Finally, if the agent's path crosses that threshold, we add the
        // boundary's side-oriented normal vector to the agent's bounce vector.
        if (path.crosses(threshold)) {
          force = force .plus (normal)
        }
      }

      return ( force.iszero ? newAgent : newAgent.bounce(force) )
    }

    const agents = this.agents.map(a => bounceIfCollided(a, a.step(Δt)))
    const time = this.time + Δt

    return new World({
      ...this,
      agents,
      time,
    })
  }
}

export { World }
