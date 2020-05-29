import { Agent } from './model.agent.js'
import { Segment, Vector } from './geometry.js'
import { minimal, zipLongest } from './utils.js'

class World {
  constructor(params) {
    this.agents = params.agents || []
    this.boundaries = params.boundaries || []
    this.time = params.time || 0
  }

  step(Δt=1) {
    const agents = this.agents
      .map((a, i, agents) => bounceAgentOffOtherAgents(a, agents))
      .map(a => bounceAgentOffBoundaries(a, a.step(Δt), this.boundaries))
    const time = this.time + Δt

    return new World({
      ...this,
      agents,
      time,
    })
  }
}

function bounceAgentOffBoundaries(oldAgent, newAgent, boundaries) {
  const path = new Segment(oldAgent.position, newAgent.position)
  const velocity = oldAgent.velocity
  const radius = newAgent.radius

  let collisionNormals = []
  let collisionIntersections = []
  let inBoundsCorrector = new Vector(0, 0)
  for (const boundary of boundaries) {
    // First we figure out which side of the boundary the original agent
    // center was on. There is a good explanation of why the following does
    // that at https://math.stackexchange.com/a/274728/783341.
    const side = ((oldAgent.x - boundary.x1) * (boundary.y2 - boundary.y1) -
                  (oldAgent.y - boundary.y1) * (boundary.x2 - boundary.x1)) >= 0 ? 1 : -1

    // We use that side to determine the correct orientation for our normal
    // (because it matters if it's pointing toward the agent or away from
    // it).
    const normal = boundary.normal .times (side)

    // If the dot product of the normal and the agent's velocity is not
    // negative, then the agent is moving away from the boundary, and so
    // shouldn't collide with it.
    if (velocity.dot(normal) >= 0) { continue }

    // Then we determine a threshold of how near the agent should be able
    // to get to the boundary before we consider it a collision. We use the
    // agent's radius to determine how far offset from the boundary the
    // threshold should be.
    const threshold = boundary.segment.offset(normal .times (radius))

    // Finally, if the agent's path crosses that threshold, we collect the
    // boundary's normal as one of the collision normals. Also collect the
    // intersection point.
    const intersection = path.crosses(threshold)
    if (intersection) {
      collisionNormals.push(normal)
      collisionIntersections.push(intersection)
    }
  }

  // Find the intersection point that is closest to the original position
  // and reposition the agent to that point. This is so that we avoid
  // "leaking" agents beyond boundaries when they get pushed out by, for
  // example, colliding with another agent as well.
  const p0 = oldAgent.position
  const innermostIntersection = minimal(collisionIntersections, p => Math.abs(p.x - p0.x) + Math.abs(p.y - p0.y))
  const repositionedAgent = (innermostIntersection === null ? newAgent : new Agent({...newAgent, position: innermostIntersection}))

  return repositionedAgent.bounce(collisionNormals)
}

function bounceAgentOffOtherAgents(agent, otherAgents) {
  function areAgentsColliding(other) {
    if (other === agent) { return false }

    const minCollisionDist = agent.radius + other.radius
    if (Math.abs(agent.x - other.x) > minCollisionDist ||
        Math.abs(agent.y - other.y) > minCollisionDist) { return false }

    const diff = agent.position.diff(other.position)
    return (
      agent.velocity.dot(diff) < 0 &&
      diff.magnitude <= minCollisionDist
    )
  }

  function getAgentCollisionNormal(other) {
    return agent.position.diff(other.position).unit
  }

  const collisionNormals = otherAgents
    .filter(areAgentsColliding)
    .map(getAgentCollisionNormal)

  return agent.bounce(collisionNormals)
}

export { World }
