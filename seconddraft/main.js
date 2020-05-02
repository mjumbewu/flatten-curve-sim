import { Agent } from './model.agent.js'
import { Boundary } from './model.boundary.js'
import { World } from './model.world.js'
import { SVGSimView } from './view.svgsim.js'

let el = document.querySelector('#simulation-world')
const W = el.viewBox.baseVal.width
const H = el.viewBox.baseVal.height

let agents = [
  new Agent({x: W / 2, y: H / 2, radius: 5})
]

let boundaries = [
  new Boundary({x1: 0, y1: 0, x2: W, y2: 0}),
  new Boundary({x1: W, y1: 0, x2: W, y2: H}),
  new Boundary({x1: W, y1: H, x2: 0, y2: H}),
  new Boundary({x1: 0, y1: H, x2: 0, y2: 0}),
]

let world = new World({agents, boundaries})

let sim = new SVGSimView({ el })
sim.draw(world)