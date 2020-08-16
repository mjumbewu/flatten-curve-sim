import { Agent } from './model.agent.js'
import { Boundary } from './model.boundary.js'
import { World } from './model.world.js'
import { Simulation } from './simulation.js'
import { LegendView } from './view.legend.js'
import { SVGSimView } from './view.svgsim.js'

let el = document.querySelector('#simulation-world')
let legend = document.querySelector('#simulation-legend')
const W = el.viewBox.baseVal.width
const H = el.viewBox.baseVal.height
const R = 5
const π = Math.PI

function rand() { return Math.random() }
function randBetween(lower, upper) { return rand() * (upper - lower) + lower }

let agents = Array(1000)
  .fill(null)
  .map(() =>
    new Agent({
      x: randBetween(R, W - R),
      y: randBetween(R, H - R),
      radius: R,
      direction: rand() * 2*π,
      speed: 2,
    })
  )

let boundaries = [
  new Boundary({x1: 0, y1: 0, x2: W, y2: 0}),
  new Boundary({x1: W, y1: 0, x2: W, y2: H}),
  new Boundary({x1: W, y1: H, x2: 0, y2: H}),
  new Boundary({x1: 0, y1: H, x2: 0, y2: 0}),

  new Boundary({x1: 2.0 * W / 3, y1: 0, x2: W, y2: 1.0 * H / 3}),
  new Boundary({x1: 0, y1: 2.0 * H / 3, x2: 1.0 * W / 3, y2: H}),
]

let world = new World({agents, boundaries})

let colors = {
  uninfected: '#266',
  infected: '#aa6c39',
  symptomatic: '#aa3939',
  recovered: '#2d882d',
  deceased: '#888',
}

let simview = new SVGSimView({ el, colors })
let legendview = new LegendView({ el: legend, colors })
legendview.initColors()
simview.draw(world)

let sim = new Simulation({world})
let starttime = new Date()
sim.on('step', e => {
  const world = e.detail.sim.world
  if (world.time % 50 == 0) {
    simview.draw(e.detail.sim.world)
  }

  if (world.time % 50 == 0) {
    const currtime = new Date()
    console.log(`${1000.0 * world.time / (currtime - starttime)} steps per second`)
  }
})
sim.start()

window.sim = sim
window.simview = simview
