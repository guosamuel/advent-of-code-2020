/*
--- Day 7: Handy Haversacks ---
You land at the regional airport in time for your next flight. In fact, it looks like you'll even have time to grab some food: all flights are currently delayed due to issues in luggage processing.

Due to recent aviation regulations, many rules (your puzzle input) are being enforced about bags and their contents; bags must be color-coded and must contain specific quantities of other color-coded bags. Apparently, nobody responsible for these regulations considered how long they would take to enforce!

For example, consider the following rules:

light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.
These rules specify the required contents for 9 bag types. In this example, every faded blue bag is empty, every vibrant plum bag contains 11 bags (5 faded blue and 6 dotted black), and so on.

You have a shiny gold bag. If you wanted to carry it in at least one other bag, how many different bag colors would be valid for the outermost bag? (In other words: how many colors can, eventually, contain at least one shiny gold bag?)

In the above rules, the following options would be available to you:

A bright white bag, which can hold your shiny gold bag directly.
A muted yellow bag, which can hold your shiny gold bag directly, plus some other bags.
A dark orange bag, which can hold bright white and muted yellow bags, either of which could then hold your shiny gold bag.
A light red bag, which can hold bright white and muted yellow bags, either of which could then hold your shiny gold bag.
So, in this example, the number of bag colors that can eventually contain at least one shiny gold bag is 4.

How many bag colors can eventually contain at least one shiny gold bag? (The list of rules is quite long; make sure you get all of it.)
*/

const fs = require('fs')

class Graph {
  constructor() {
    this.adjList = {}
  }

  addVertex(vertex) {
    if (!this.adjList.hasOwnProperty(vertex)) this.adjList[vertex] = []
  }

  addEdge(vertex, edge) {
    if (!this.adjList.hasOwnProperty(vertex)) this.addVertex(vertex)
    this.adjList[vertex].push(edge)
  }

}

fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) console.log(err)

  const g = new Graph()

  const YOUR_BAG = 'shiny gold'

  const parsedData = data.split('\n')

  if (parsedData[parsedData.length-1].length === 0) parsedData.pop()

  for (let i = 0; i < parsedData.length; i++) {
    parsedData[i] = parsedData[i].split(" contain ")
    const sanitizedVertex = parsedData[i][0].split(" ")
    sanitizedVertex.pop()
    const vertex = sanitizedVertex.join(" ")
    g.addVertex(vertex)

    if (parsedData[i][1] === 'no other bags.') continue

    const bagContents = parsedData[i][1].split(", ")
    for (let j = 0; j < bagContents.length; j++) {
      const bagContentData = bagContents[j].split(" ")
      const edge = []
      edge[0] = bagContentData[0]
      bagContentData.pop()
      bagContentData.shift()
      const bag = bagContentData.join(" ")
      edge[1] = bag
      g.addEdge(vertex,edge)
    }
  }

  /*
  {
    'light red': [ [ '1', 'bright white' ], [ '2', 'muted yellow' ] ],
    'dark orange': [ [ '3', 'bright white' ], [ '4', 'muted yellow' ] ],
    'bright white': [ [ '1', 'shiny gold' ] ],
    'muted yellow': [ [ '2', 'shiny gold' ], [ '9', 'faded blue' ] ],
    'shiny gold': [ [ '1', 'dark olive' ], [ '2', 'vibrant plum' ] ],
    'dark olive': [ [ '3', 'faded blue' ], [ '4', 'dotted black' ] ],
    'vibrant plum': [ [ '5', 'faded blue' ], [ '6', 'dotted black' ] ],
    'faded blue': [],
    'dotted black': []
  }
  */

  const visitedTowardsYourBag = {}

  function dfs(currentBag, yourBag, tracker) {

    if (currentBag === YOUR_BAG) {
      for (let j = 0; j < tracker.length; j++) {
        visitedTowardsYourBag[tracker[j]] = true
      }
      return
    }

    if (g.adjList[currentBag].length === 0) return

    for (let i = 0; i < g.adjList[currentBag].length; i++) {
      tracker.push(currentBag)
      dfs(g.adjList[currentBag][i][1], YOUR_BAG, tracker)
      tracker.pop()
    }
  }

  for (let key in g.adjList) {
    dfs(key, YOUR_BAG, [])
  }

  console.log(Object.keys(visitedTowardsYourBag).length)
})