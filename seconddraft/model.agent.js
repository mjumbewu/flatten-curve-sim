function Agent(params) {
  this.x = params.x
  this.y = params.y
  this.radius = params.radius
  this.direction = params.direction
  this.speed = params.speed
  this.time = params.time || 0
}

Agent.prototype.step = function(Δt=1) {
  // Calculate the change in position based on how much time has ellapsed (dt)
  const Δx = Math.cos(this.direction) * this.speed * Δt
  const Δy = Math.sin(this.direction) * this.speed * Δt

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

export { Agent }
