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

    let getBounceVector = (agentStates) => {
      const [old_, new_] = agentStates
      const path = new Segment(old_.position, new_.position)
      const radius = new_.radius

      let agentBounceVector = zero
      for (const boundary of this.boundaries) {
        // First we figure out which side of the boundary the original agent
        // center was on. There is a good explanation of why the following does
        // that at https://math.stackexchange.com/a/274728/783341.
        const side = ((old_.x - boundary.x1) * (boundary.y2 - boundary.y1) -
                      (old_.y - boundary.y1) * (boundary.x2 - boundary.x1)) >= 0 ? 1 : -1

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
          agentBounceVector = agentBounceVector .plus (normal)
        } else {
          const _ = 1 + 1;
        }
      }
      return agentBounceVector
    }

    let getBouncedAgent = (args) => {
      const [agent, vector] = args
      return agent.bounce(vector)
    }

    const steppedAgents = this.agents.map(a => a.step(Δt))
    const bounceVectors = Array.from(zipLongest(this.agents, steppedAgents)).map(getBounceVector)
    const agents = Array.from(zipLongest(steppedAgents, bounceVectors)).map(getBouncedAgent)
    const time = this.time + Δt

    return new World({
      ...this,
      agents,
      time,
    })
  }
}

export { World }
