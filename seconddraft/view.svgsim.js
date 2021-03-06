import { zipLongest } from './utils.js'

class SVGSimView {
  constructor(options) {
    this.worldEl = options.el
    this.agentEls = []
    this.boundaryEls = []
    this.styleEl = null
    this.colors = options.colors
  }

  initStyle() {
    if (!this.styleEl) {
      this.styleEl = document.createElement('style')
      const css = Object.entries(this.colors)
        .map(([health, color]) => `.${health} { fill: ${color}; }`)
        .join('\n')
      this.styleEl.innerHTML = css
      this.worldEl.appendChild(this.styleEl)
    }
    return this
  }

  draw(world) {
    this.initStyle()

    // == DRAW THE AGENTS ==
    // Match up each agent in the world with an SVG circle element. Ensure that
    // we're dealing with exactly as many circle elements as we are agents. If
    // there are more agents than circles, create new circle elements for the
    // unrepresented agents. If there are more circles than agents, remove the
    // extra elements.
    for (let [agent, agentEl] of zipLongest(world.agents, this.agentEls)) {
      if (!agent) {
        if (agentEl) agentEl.remove()
        continue
      }

      agentEl = agentEl || this.makeAgentEl()
      agentEl.setAttribute('cx', agent.x)
      agentEl.setAttribute('cy', agent.y)
      agentEl.setAttribute('r', agent.radius)

      const health = agent.health
      const color = this.colors[health]
      agentEl.setAttribute('class', health)
    }

    // == DRAW THE BOUNDARIES ==
    // Next, do the same kind of matching between world boundaries and SVG
    // line elements.
    for (let [boundary, boundaryEl] of zipLongest(world.boundaries, this.boundaryEls)) {
      if (!boundary) {
        if (boundaryEl) boundaryEl.remove()
        continue
      }

      boundaryEl = boundaryEl || this.makeBoundaryEl()
      boundaryEl.setAttribute('x1', boundary.x1)
      boundaryEl.setAttribute('y1', boundary.y1)
      boundaryEl.setAttribute('x2', boundary.x2)
      boundaryEl.setAttribute('y2', boundary.y2)
    }
  }

  makeAgentEl() {
    let agentEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    agentEl.setAttribute('class', 'simulation-agent')
    this.agentEls.push(agentEl)
    this.worldEl.appendChild(agentEl)
    return agentEl
  }

  makeBoundaryEl() {
    let boundaryEl = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    boundaryEl.setAttribute('class', 'simulation-boundary')
    this.boundaryEls.push(boundaryEl)
    this.worldEl.appendChild(boundaryEl)
    return boundaryEl
  }
}

export {
  SVGSimView
}