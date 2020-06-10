class LegendView {
  constructor(options) {
    this.legendEl = options.el
    this.colors = options.colors
  }

  initColors() {
    this.style = document.createElement('style')
    const css = Object.entries(this.colors)
      .map(([state, color]) => `.${state}::before { background-color: ${color}; }` +
                               `.${state} { color: ${color}; }`)
      .join('\n')
    this.style.innerHTML = css

    this.legendEl.insertBefore(this.style, this.legendEl.firstChild)
    return this
  }
}

export { LegendView }