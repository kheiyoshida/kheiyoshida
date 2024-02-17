import { expect } from "test-utils";
import { createDonutGraph } from "./primitives";

test(`${createDonutGraph.name}`, ()=> {
  const graph = createDonutGraph(100, 90, 12)
  expect(graph[0].position.array()).toMatchCloseObject([0, 0, 100])
  expect(graph[0].distanceToEachVertex).toBe(90)
  expect(graph.length).toBe(12)
})
