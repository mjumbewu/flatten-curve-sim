class Simulation {
  constructor(params) {
    this.world = params.world
    this.stepDelay = params.stepDelay || 0

    // Create an EventTarget for the simulation that will allow us to notify
    // other parts of the program when simulation events happen, like when
    // we've started or stopped running, or when we've completed a step.
    this.target = new EventTarget()
  }

  start() {
    // Schedule the first step with no delay.
    this._scheduleNextSteps(0)

    // Trigger a "start" event to let the rest of the program know that we've
    // started.
    this.trigger('start')

    return this
  }

  _scheduleNextSteps(delay) {
    // After a delay of some milliseconds, queue the _runNextStep method to be
    // called again.
    this.stepTimer = setTimeout(() => this._runNextStep(), delay)
  }

  _runNextStep(keepGoing=true) {
    // Step the world forward.
    const world0 = this.world
    this.world = world0.step()

    // Schedule the next step, if we're supposed to.
    if (keepGoing) { this._scheduleNextSteps(this.stepDelay) }

    // Trigger a "step" event to let the rest of the program know that we've
    // completed another step.
    this.trigger('step')
  }

  step() {
    // Sometimes we might want to just perform a single step.
    this._runNextStep(false)
    return this
  }

  stop() {
    // To stop the simulation, cancel any upcoming scheduled steps.
    clearTimeout(this.stepTimer)
    delete this.stepTimer

    // trigger a "stop" event to let the rest of the program know that we've
    // stopped the simulation.
    this.trigger('stop')

    return this
  }

  trigger(eventName) {
    this.target.dispatchEvent(new CustomEvent(eventName, {
      detail: { sim: this }
    }))
    return this
  }

  on(eventName, callback) {
    this.target.addEventListener(eventName, callback)
    return this
  }
}

export { Simulation }
