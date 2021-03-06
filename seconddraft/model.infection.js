class Infection {
  constructor(params) {
    this.infectedtime = params.infectedtime || null
    this.asymptomaticdur = params.asymptomaticdur || null
    this.symptomaticdur = params.symptomaticdur || null
    this.infectiousness = params.infectiousness || null
  }

  get symptomatictime() {
    return this.infectedtime + this.asymptomaticdur
  }
  get resolvedtime() {
    return this.infectedtime + this.asymptomaticdur + this.symptomaticdur
  }

  healthAtTime(t) {
    if (this.infectedtime === null || t < this.infectedtime) {
      return 'uninfected'
    } else if (t < t.symptomatictime) {
      return 'infected'
    } else if (t < t.resolvedtime) {
      return 'symptomatic'
    } else {
      return 'recovered'
    }
  }
}

export { Infection }