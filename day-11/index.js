/*
--- Day 11: Seating System ---
Your plane lands with plenty of time to spare. The final leg of your journey is a ferry that goes directly to the tropical island where you can finally start your vacation. As you reach the waiting area to board the ferry, you realize you're so early, nobody else has even arrived yet!

By modeling the process people use to choose (or abandon) their seat in the waiting area, you're pretty sure you can predict the best place to sit. You make a quick map of the seat layout (your puzzle input).

The seat layout fits neatly on a grid. Each position is either floor (.), an empty seat (L), or an occupied seat (#). For example, the initial seat layout might look like this:

L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL
Now, you just need to model the people who will be arriving shortly. Fortunately, people are entirely predictable and always follow a simple set of rules. All decisions are based on the number of occupied seats adjacent to a given seat (one of the eight positions immediately up, down, left, right, or diagonal from the seat). The following rules are applied to every seat simultaneously:

If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
Otherwise, the seat's state does not change.
Floor (.) never changes; seats don't move, and nobody sits on the floor.

After one round of these rules, every seat in the example layout becomes occupied:

#.##.##.##
#######.##
#.#.#..#..
####.##.##
#.##.##.##
#.#####.##
..#.#.....
##########
#.######.#
#.#####.##
After a second round, the seats with four or more occupied adjacent seats become empty again:

#.LL.L#.##
#LLLLLL.L#
L.L.L..L..
#LLL.LL.L#
#.LL.LL.LL
#.LLLL#.##
..L.L.....
#LLLLLLLL#
#.LLLLLL.L
#.#LLLL.##
This process continues for three more rounds:

#.##.L#.##
#L###LL.L#
L.#.#..#..
#L##.##.L#
#.##.LL.LL
#.###L#.##
..#.#.....
#L######L#
#.LL###L.L
#.#L###.##
#.#L.L#.##
#LLL#LL.L#
L.L.L..#..
#LLL.##.L#
#.LL.LL.LL
#.LL#L#.##
..L.L.....
#L#LLLL#L#
#.LLLLLL.L
#.#L#L#.##
#.#L.L#.##
#LLL#LL.L#
L.#.L..#..
#L##.##.L#
#.#L.LL.LL
#.#L#L#.##
..L.L.....
#L#L##L#L#
#.LLLLLL.L
#.#L#L#.##
At this point, something interesting happens: the chaos stabilizes and further applications of these rules cause no seats to change state! Once people stop moving around, you count 37 occupied seats.

Simulate your seating area by applying the seating rules repeatedly until no seats change state. How many seats end up occupied?
*/

const fs = require('fs')

fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) console.log(err)

  const parsedData = data.split('\n')

  if (parsedData[parsedData.length-1].length === 0) parsedData.pop()

  for (let i = 0; i < parsedData.length; i++) {
    parsedData[i] = parsedData[i].split('')
  }

  function seatRecursion(array) {
    const newArray = []

    for (let i = 0; i < array.length; i++) {
      newArray.push([])
    }

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {

        if (array[i][j] === 'L') {
          let areThereOccupiedAdjacentSeats = false

          for (let k = i-1; k <= i+1; k++) {

            // boundaries
            if (k < 0 || k > array.length-1) continue

            for (let l = j-1; l <= j+1; l++) {

              // boundaries
              if (l < 0 || l > array[k].length-1) continue
              if (k === i && l === j) continue

              if (array[k][l] === '#') {
                areThereOccupiedAdjacentSeats = true
                break
              }
            }

            if (areThereOccupiedAdjacentSeats) break

          }

          if (!areThereOccupiedAdjacentSeats) {
            newArray[i][j] = '#'
          } else {
            newArray[i][j] = array[i][j]
          }

        } else if (array[i][j] === '#') {
          let adjacentOccupiedSeatsCount = 0

          for (let k = i-1; k <= i+1; k++) {

            // boundaries
            if (k < 0 || k > array.length-1) continue

            for (let l = j-1; l <= j+1; l++) {

              // boundaries
              if (l < 0 || l > array[k].length-1) continue
              if (k === i && l === j) continue

              if (array[k][l] === '#') {
                adjacentOccupiedSeatsCount++
              }

              if (adjacentOccupiedSeatsCount === 4) break
            }

            if (adjacentOccupiedSeatsCount === 4) break
          }

          if (adjacentOccupiedSeatsCount === 4) {
            newArray[i][j] = 'L'
          } else {
            newArray[i][j] = array[i][j]
          }

        } else {
          newArray[i][j] = array[i][j]
        }
      }
    }

    if (isSameArray(array, newArray)) {
      return array
    } else {
      return seatRecursion(newArray)
    }

  }

  function isSameArray(array1, array2) {

    for (let i = 0; i < array1.length; i++) {
      for (let j = 0; j < array1[i].length; j++) {
        if (array1[i][j] === array2[i][j]) {
          continue
        } else {
          return false
        }
      }
    }

    return true
  }

  const finalSeating = seatRecursion(parsedData)

  let occupiedSeatCount = 0

  for (let i = 0; i < finalSeating.length; i++) {
    for (let j = 0; j < finalSeating[i].length; j++) {
      if (finalSeating[i][j] === '#') occupiedSeatCount++
    }
  }

  // console.log(occupiedSeatCount)
})

/*
--- Part Two ---
As soon as people start to arrive, you realize your mistake. People don't just care about adjacent seats - they care about the first seat they can see in each of those eight directions!

Now, instead of considering just the eight immediately adjacent seats, consider the first seat in each of those eight directions. For example, the empty seat below would see eight occupied seats:

.......#.
...#.....
.#.......
.........
..#L....#
....#....
.........
#........
...#.....
The leftmost empty seat below would only see one empty seat, but cannot see any of the occupied ones:

.............
.L.L.#.#.#.#.
.............
The empty seat below would see no occupied seats:

.##.##.
#.#.#.#
##...##
...L...
##...##
#.#.#.#
.##.##.
Also, people seem to be more tolerant than you expected: it now takes five or more visible occupied seats for an occupied seat to become empty (rather than four or more from the previous rules). The other rules still apply: empty seats that see no occupied seats become occupied, seats matching no rule don't change, and floor never changes.

Given the same starting layout as above, these new rules cause the seating area to shift around as follows:

L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL
#.##.##.##
#######.##
#.#.#..#..
####.##.##
#.##.##.##
#.#####.##
..#.#.....
##########
#.######.#
#.#####.##
#.LL.LL.L#
#LLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLL#
#.LLLLLL.L
#.LLLLL.L#
#.L#.##.L#
#L#####.LL
L.#.#..#..
##L#.##.##
#.##.#L.##
#.#####.#L
..#.#.....
LLL####LL#
#.L#####.L
#.L####.L#
#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##LL.LL.L#
L.LL.LL.L#
#.LLLLL.LL
..L.L.....
LLLLLLLLL#
#.LLLLL#.L
#.L#LL#.L#
#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##L#.#L.L#
L.L#.#L.L#
#.L####.LL
..#.#.....
LLL###LLL#
#.LLLLL#.L
#.L#LL#.L#
#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##L#.#L.L#
L.L#.LL.L#
#.LLLL#.LL
..#.L.....
LLL###LLL#
#.LLLLL#.L
#.L#LL#.L#
Again, at this point, people stop shifting around and the seating area reaches equilibrium. Once this occurs, you count 26 occupied seats.

Given the new visibility method and the rule change for occupied seats becoming empty, once equilibrium is reached, how many seats end up occupied?


*/

fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) console.log(err)

  const parsedData = data.split('\n')

  if (parsedData[parsedData.length-1].length === 0) parsedData.pop()

  for (let i = 0; i < parsedData.length; i++) {
    parsedData[i] = parsedData[i].split('')
  }

  function seatRecursion(array) {
    const newArray = []

    for (let i = 0; i < array.length; i++) {
      newArray.push([])
    }

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {

        if (array[i][j] === 'L') {
          let areThereOccupiedDirectionalSeats = false

          const directionHasOccupiedSeat = {}
          let x = j
          let y = i
          const limit = Math.max( (array.length-1) - y, y, (array[y].length-1) - x, x )

          let delta = 1

          while (delta <= limit && !areThereOccupiedDirectionalSeats) {

            // north
            if (!directionHasOccupiedSeat['north'] && y - delta >= 0) {
              if (array[y-delta][x] !== '.') directionHasOccupiedSeat['north'] = true
              if (array[y-delta][x] === '#') areThereOccupiedDirectionalSeats = true
            }

            // east
            if (!directionHasOccupiedSeat['east'] && x + delta < array[y].length) {
              if (array[y][x+delta] !== '.') directionHasOccupiedSeat['east'] = true
              if (array[y][x+delta] === '#') areThereOccupiedDirectionalSeats = true
            }

            // south
            if (!directionHasOccupiedSeat['south'] && y + delta < array.length) {
              if (array[y+delta][x] !== '.') directionHasOccupiedSeat['south'] = true
              if (array[y+delta][x] === '#') areThereOccupiedDirectionalSeats = true
            }

            // west
            if (!directionHasOccupiedSeat['west'] && x - delta >= 0) {
              if (array[y][x-delta] !== '.') directionHasOccupiedSeat['west'] = true
              if (array[y][x-delta] === '#') areThereOccupiedDirectionalSeats = true
            }

            // north-east
            if (!directionHasOccupiedSeat['north-east'] && y - delta >= 0 && x + delta < array[y].length) {
              if (array[y-delta][x+delta] !== '.') directionHasOccupiedSeat['north-east'] = true
              if (array[y-delta][x+delta] === '#') areThereOccupiedDirectionalSeats = true
            }

            // south-east
            if (!directionHasOccupiedSeat['south-east'] && y + delta < array.length && x + delta < array[y].length) {
              if (array[y+delta][x+delta] !== '.') directionHasOccupiedSeat['south-east'] = true
              if (array[y+delta][x+delta] === '#') areThereOccupiedDirectionalSeats = true
            }

            // south-west
            if (!directionHasOccupiedSeat['south-west'] && y + delta < array.length && x - delta >= 0) {
              if (array[y+delta][x-delta] !== '.') directionHasOccupiedSeat['south-west'] = true
              if (array[y+delta][x-delta] === '#') areThereOccupiedDirectionalSeats = true
            }

            // north-west
            if (!directionHasOccupiedSeat['north-west'] && y - delta >= 0 && x - delta >= 0) {
              if (array[y-delta][x-delta] !== '.') directionHasOccupiedSeat['north-west'] = true
              if (array[y-delta][x-delta] === '#') areThereOccupiedDirectionalSeats = true
            }

            delta++
          }

          if (!areThereOccupiedDirectionalSeats) {
            newArray[i][j] = '#'
          } else {
            newArray[i][j] = array[i][j]
          }

        } else if (array[i][j] === '#') {
          let adjacentOccupiedSeatsCount = 0

          const directionHasOccupiedSeat = {}
          let x = j
          let y = i
          const limit = Math.max( (array.length-1) - y, y, (array[y].length-1) - x, x )

          let delta = 1

          while (delta <= limit && adjacentOccupiedSeatsCount < 5) {
            // north
            if (!directionHasOccupiedSeat['north'] && y - delta >= 0) {
              if (array[y-delta][x] !== '.') directionHasOccupiedSeat['north'] = true
              if (array[y-delta][x] === '#') adjacentOccupiedSeatsCount++
            }

            // east
            if (!directionHasOccupiedSeat['east'] && x + delta < array[y].length) {
              if (array[y][x+delta] !== '.') directionHasOccupiedSeat['east'] = true
              if (array[y][x+delta] === '#') adjacentOccupiedSeatsCount++
            }

            // south
            if (!directionHasOccupiedSeat['south'] && y + delta < array.length) {
              if (array[y+delta][x] !== '.') directionHasOccupiedSeat['south'] = true
              if (array[y+delta][x] === '#') adjacentOccupiedSeatsCount++
            }

            // west
            if (!directionHasOccupiedSeat['west'] && x - delta >= 0) {
              if (array[y][x-delta] !== '.') directionHasOccupiedSeat['west'] = true
              if (array[y][x-delta] === '#') adjacentOccupiedSeatsCount++
            }

            // north-east
            if (!directionHasOccupiedSeat['north-east'] && y - delta >= 0 && x + delta < array[y].length) {
              if (array[y-delta][x+delta] !== '.') directionHasOccupiedSeat['north-east'] = true
              if (array[y-delta][x+delta] === '#') adjacentOccupiedSeatsCount++
            }

            // south-east
            if (!directionHasOccupiedSeat['south-east'] && y + delta < array.length && x + delta < array[y].length) {
              if (array[y+delta][x+delta] !== '.') directionHasOccupiedSeat['south-east'] = true
              if (array[y+delta][x+delta] === '#') adjacentOccupiedSeatsCount++
            }

            // south-west
            if (!directionHasOccupiedSeat['south-west'] && y + delta < array.length && x - delta >= 0) {
              if (array[y+delta][x-delta] !== '.') directionHasOccupiedSeat['south-west'] = true
              if (array[y+delta][x-delta] === '#') adjacentOccupiedSeatsCount++
            }

            // north-west
            if (!directionHasOccupiedSeat['north-west'] && y - delta >= 0 && x - delta >= 0) {
              if (array[y-delta][x-delta] !== '.') directionHasOccupiedSeat['north-west'] = true
              if (array[y-delta][x-delta] === '#') adjacentOccupiedSeatsCount++
            }

            delta++
          }

          if (adjacentOccupiedSeatsCount >= 5) {
            newArray[i][j] = 'L'
          } else {
            newArray[i][j] = array[i][j]
          }

        } else {
          newArray[i][j] = array[i][j]
        }
      }
    }

    /*
    const copy = [...newArray]
    for (let i = 0; i < copy.length; i++) {
      copy[i] = copy[i].join("")
    }
    copy.push('\n')
    console.log(copy.join('\n'))
    */

    if (isSameArray(array, newArray)) {
      return array
    } else {
      return seatRecursion(newArray)
    }
  }

  function isSameArray(array1, array2) {

    for (let i = 0; i < array1.length; i++) {
      for (let j = 0; j < array1[i].length; j++) {
        if (array1[i][j] === array2[i][j]) {
          continue
        } else {
          return false
        }
      }
    }

    return true
  }

  const finalSeating = seatRecursion(parsedData)

  let occupiedSeatCount = 0

  for (let i = 0; i < finalSeating.length; i++) {
    for (let j = 0; j < finalSeating[i].length; j++) {
      if (finalSeating[i][j] === '#') occupiedSeatCount++
    }
  }

  console.log(occupiedSeatCount)
})
