function World(params) {
  this.agents = params.agents || []
  this.boundaries = params.boundaries || []
  this.time = params.time || 0
}

World.prototype.step = function(Δt=1) {
  const agents = this.agents.map(a => a.step(Δt))
  const time = this.time + Δt

  return new World({
    ...this,
    agents,
    time,
  })
}

export { World }
