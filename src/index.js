import fs from "fs"
import {
  fetchLand,
  dual,
  shock,
  bond,
  slow,
  pain,
  check,
  pathway,
  filter,
  horizon,
  tango,
  bounce,
  triomeCycle,
  manaPips,
  basic,
} from "./code/lands.js"
import {
  choose,
  randomInt,
  random,
  onlyUnique,
  sortUniqueString,
  colors,
  processArgs,
  remove,
  addMana,
} from "./code/util.js"
import { rebuildData } from "./code/rebuild.js"


const run = async () => {
  const { fetchData, rebuild } = processArgs()
  if (rebuild) {
    await rebuildData(fetchData)
  }
  // ------------------------------------------ MAKE DECK ------------------------------------------
  const randomColor = [
    "Faceless One",
    "Clara Oswald",
    "The Prismatic Piper",
  ]
  const commander = random(JSON.parse(fs.readFileSync('./jsons/commanders.json', { encoding: "utf8" })))
  // const commander = JSON.parse(fs.readFileSync('./jsons/commanders.json', { encoding: "utf8" })).find(item => item.name === "")
  const commanderColors = randomColor.includes(commander.name) ? choose(colors, 1) : commander.colorIdentity
  const invertedColors = colors.filter(item => !commanderColors.includes(item))
  const fullFiltered = JSON.parse(fs.readFileSync('./jsons/filtered.json', { encoding: "utf8" }))
  const filtered = Object.values(fullFiltered)
  const refiltered = filtered.filter(item => (!invertedColors.map(str => item.colorIdentity.includes(str)).reduce((a,b) => a||b, false)) && item.name !== commander.name).map(item => item.name)
  const deck = choose(refiltered, 64 - (commanderColors.length === 0 ? 1 : commanderColors.length))

  // ------- PIPS ---------
  const pips = {}
  const manaPipsTotal = {}
  commanderColors.forEach(element => {
    pips[element] = 0
    manaPipsTotal[element] = 0
  });
  deck.forEach(element => {
    const card = fullFiltered[element]
    card.manaCost && card.manaCost.replaceAll(/[^WUBRG]/g,"").split("").forEach(mana => {
      pips[mana] += 1
    })
  });
  // ------------------------------------------ MAKE MANA ------------------------------------------
  const utility = Object.values(JSON.parse(fs.readFileSync('./jsons/lands.json', {encoding: "utf8"}))).filter(item => (!invertedColors.map(str => item.colorIdentity.includes(str)).reduce((a,b) => a||b, false))).map(item => item.name)
  let mana = commanderColors.length > 1 ? ["Command Tower", "Prismatic Vista", ...onlyUnique(commanderColors.map(type => Object.keys(fetchLand).filter(dual => dual.includes(type))).flat(5)).map(type => fetchLand[type])] : [...choose(utility, 8 + randomInt(3))]
  const dualColors = onlyUnique(commanderColors.map((type,index) => commanderColors.map((t,i) => i > index ? `${type}${t}` : null)).flat(5))
  const triColors = onlyUnique(dualColors.map((type,index) => dualColors.map((t,i) => i > index ? sortUniqueString(`${type}${t}`) : null)).flat(5)).filter(item => item.length === 3)

  if (commanderColors.length === 2) {
    mana = mana.concat([
      dual[dualColors[0]],
      shock[dualColors[0]],
      bond[dualColors[0]],
      slow[dualColors[0]],
      pain[dualColors[0]],
      check[dualColors[0]],
      pathway[dualColors[0]],
      filter[dualColors[0]],
      {...horizon, ...tango}[dualColors[0]],
      bounce[dualColors[0]],
      ...choose(utility, 6 + randomInt(3)),
    ])
  } else if (commanderColors.length === 3) {
    const rainbows = [
      "City of Brass",
      "Mana Confluence",
      "Reflecting Pool",
    ]
    mana = mana.concat([
      ...rainbows,
      ...triColors.map(type => triomeCycle[type]),
      ...dualColors.map(type => dual[type]),
      ...dualColors.map(type => shock[type]),
      ...dualColors.map(type => bond[type]),
      ...dualColors.map(type => slow[type]),
      ...dualColors.map(type => horizon[type]),
      ...choose(remove(utility, rainbows), 4 + randomInt(3)),
    ])
  } else if (commanderColors.length > 3) {
    const rainbows = [
      "City of Brass",
      "Mana Confluence",
      "Reflecting Pool",
      "Exotic Orchard",
    ]
    mana = mana.concat([
      ...rainbows,
      ...choose(triColors.map(type => triomeCycle[type]), 3),
      ...dualColors.map(type => dual[type]),
      ...choose(dualColors.map(type => shock[type]), 3 + randomInt(4)),
      ...choose(dualColors.map(type => bond[type]), 2 + randomInt(2)),
      ...choose(dualColors.map(type => horizon[type]), 1 + randomInt(3)),
      ...choose(remove(utility, rainbows), 2 + randomInt(3)),
    ])
  }

  const finalDeck = onlyUnique([...mana, ...deck])
  
  onlyUnique(mana).forEach(name => {
    const localPips = manaPips[name]
    if (localPips) {
      localPips.split("").forEach(pip => {
        manaPipsTotal[pip] += 1
      })
    }
  })

  let basicLands = {}
  for (let i = finalDeck.length; i < 99; i++) {
    const manaToAdd = addMana(pips, manaPipsTotal)
    manaPipsTotal[manaToAdd] += 1
    let type = basic[manaToAdd]
    if (basicLands[type] === undefined) {
      basicLands[type] = 0
    }
    basicLands[type] += 1
  }

  const cockatrice =
`Mainboard
${finalDeck.map(str => `1 ${str}`).join("\n")}
${Object.keys(basicLands).map(str => `${basicLands[str]} ${str}`).join("\n")}

SideBoard
1 ${commander.name}`

  fs.writeFileSync("../cockatrice.txt", cockatrice, { encoding: "utf8" })

  const archidekt =
`${finalDeck.map(str => `1 ${str}`).join("\n")}
${Object.keys(basicLands).map(str => `${basicLands[str]} ${str}`).join("\n")}
1 ${commander.name}[Commander{top}]`

  fs.writeFileSync("../archidekt.txt", archidekt, { encoding: "utf8" })
}

run()
