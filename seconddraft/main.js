import { Agent } from './model.agent.js'
import { Boundary } from './model.boundary.js'
import { World } from './model.world.js'
import { Simulation } from './simulation.js'
import { SVGSimView } from './view.svgsim.js'

let el = document.querySelector('#simulation-world')
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
      speed: 1,
    })
  )

let boundaries = [
  new Boundary({x1: 0, y1: 0, x2: W, y2: 0}),
  new Boundary({x1: W, y1: 0, x2: W, y2: H}),
  new Boundary({x1: W, y1: H, x2: 0, y2: H}),
  new Boundary({x1: 0, y1: H, x2: 0, y2: 0}),
]

let world = new World({agents, boundaries})

let simview = new SVGSimView({ el })
simview.draw(world)

let sim = new Simulation({world})
sim.on('step', e => simview.draw(e.detail.sim.world))
sim.start()

window.sim = sim
window.simview = simview
