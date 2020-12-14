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

  // console.log(Object.keys(visitedTowardsYourBag).length)
})

/*
--- Part Two ---
It's getting pretty expensive to fly these days - not because of ticket prices, but because of the ridiculous number of bags you need to buy!

Consider again your shiny gold bag and the rules from the above example:

faded blue bags contain 0 other bags.
dotted black bags contain 0 other bags.
vibrant plum bags contain 11 other bags: 5 faded blue bags and 6 dotted black bags.
dark olive bags contain 7 other bags: 3 faded blue bags and 4 dotted black bags.
So, a single shiny gold bag must contain 1 dark olive bag (and the 7 bags within it) plus 2 vibrant plum bags (and the 11 bags within each of those): 1 + 1*7 + 2 + 2*11 = 32 bags!

Of course, the actual rules have a small chance of going several levels deeper than this example; be sure to count all of the bags, even if the nesting becomes topologically impractical!

Here's another example:

shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.
In this example, a single shiny gold bag must contain 126 other bags.

How many individual bags are required inside your single shiny gold bag?
*/

fs.readFile('./dummy-input.txt', 'utf8', (err, data) => {
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
  let count = 0

  function bagCount(bag) {
    console.log("at the top of the function", bag)
    if (g.adjList[bag].length === 0) {
      console.log("in the base case", bag)
      return 1
    }
    /*
    [ '1', 'dark olive' ]
    [ '3', 'faded blue' ]
    [ '4', 'dotted black' ]
    [ '2', 'vibrant plum' ]
    [ '5', 'faded blue' ]
    [ '6', 'dotted black' ]
    */
    for (let k = 0; k < g.adjList[bag].length; k++) {
      console.log(g.adjList[bag], k)
      let currentBag = g.adjList[bag][k]
      // console.log("CURRENT BAG", currentBag[1])
      // console.log("BEFORE ADDING", count)
      count += Number(currentBag[0]) * bagCount(currentBag[1])
      // console.log("RETURN FUNCTION FOR THE CALL", bagCount(currentBag[1]))
      // console.log("CURRENT NUMBER RIGHT AFTER ADDING", currentBag[0])
      // console.log("JUST FINISHED ADDING", currentBag[1])

      console.log(count)
    }
  }

  bagCount(YOUR_BAG)

  console.log(count)
})
