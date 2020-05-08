import { Segment, Vector } from './geometry.js'
import { zipLongest } from './utils.js'

function World(params) {
  this.agents = params.agents || []
  this.boundaries = params.boundaries || []
  this.time = params.time || 0
}

World.prototype.step = function(Δt=1) {
  let getBounceVector = (agentStates) => {
    const [old_, new_] = agentStates
    const Δx = new_.x - old_.x
    const Δy = new_.y - old_.y
    const zeroVector = new Vector(0, 0)

    let agentBounceVector = zeroVector
    for (const boundary of this.boundaries) {
      // First we figure out which side of the boundary the original agent
      // center was on. There is a good explanation of why the following does
      // that at https://math.stackexchange.com/a/274728/783341.
      const side = ((old_.x - boundary.x1) * (boundary.y2 - boundary.y1) -
                    (old_.y - boundary.y1) * (boundary.x2 - boundary.x1)) >= 0 ? 1 : -1

      // Then we find the nearest point on the edge of the agent to the
      // boundary. This is going to be the point along the agents edge in the
      // direction (or opposite direction, depending on the side) of the
      // boundary's normal vector.
      const normal = boundary.normal
      const oldNearestX = old_.x - (normal.x * old_.radius) * side
      const oldNearestY = old_.y - (normal.y * old_.radius) * side
      const newNearestX = new_.x - (normal.x * new_.radius) * side
      const newNearestY = new_.y - (normal.y * new_.radius) * side
      const nearestPointPath = new Segment(oldNearestX, oldNearestY, newNearestX, newNearestY)

      if (boundary.isCrossedBy(nearestPointPath)) {
        agentBounceVector = agentBounceVector.plus(normal.times(side))
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

export { World }
