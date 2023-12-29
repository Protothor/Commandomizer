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
} from "./code/lands.js"
import {
  choose,
  randomInt,
  random,
  onlyUnique,
  sortUniqueString,
  colors,
  processArgs,
} from "./code/util.js"


const run = async () => {
  const { fetchData, rebuild } = processArgs()
  if (rebuild) {
    // ------------------------------------------ FETCH ------------------------------------------
    const cards = fetchData ? await (fetch("https://mtgjson.com/api/v5/AllPrintings.json").then(v => v.text()).then((data) => {
      fs.writeFileSync('./jsons/AllPrintings.json', data, { encoding: "utf8" })  
      return JSON.parse(data)
    })) : JSON.parse(fs.readFileSync('./jsons/AllPrintings.json', { encoding: "utf8" }))
    // ------------------------------------------ MAKE DB ------------------------------------------    
    const db = Object.keys(cards.data).map(key => cards.data[key].cards).flat(1).filter(item => !item.isFunny && !item.subtypes.includes("Attraction"))
    fs.writeFileSync('./jsons/db.json', JSON.stringify(db, null, 2), { encoding: "utf8" })
    // ------------------------------------------ FILTER PLAY ------------------------------------------
    const filtered = {}
    db.filter(e => e.language === "English" && e.legalities.commander === "Legal" && !e.type.includes("Land")).map(({ colors, colorIdentity, manaCost, name, subtypes, supertypes, text, type, types }) => ({ colors, colorIdentity, manaCost, name, subtypes, supertypes, text, type, types })).forEach(element => { filtered[element.name] = element });

    fs.writeFileSync('./jsons/filtered.json', JSON.stringify(filtered, null, 2), { encoding: "utf8" })

    // ------------------------------------------ FILTER LAND ------------------------------------------
    const landFilter = JSON.parse(fs.readFileSync('./jsons/landFilter.json', { encoding: "utf8" }))

    const lands = {}
    db.filter(e => e.language === "English" && e.legalities.commander === "Legal" && e.type.includes("Land") && !landFilter.includes(e.name)).map(({ colors, colorIdentity, manaCost, name, subtypes, supertypes, text, type, types }) => ({ colors, colorIdentity, manaCost, name, subtypes, supertypes, text, type, types })).forEach(element => { lands[element.name] = element });

    fs.writeFileSync('./jsons/lands.json', JSON.stringify(lands, null, 2), { encoding: "utf8" })
    // ------------------------------------------ MAKE COMMANDER LIST ------------------------------------------
    const commanders = Object.keys(filtered).map(key => filtered[key]).filter(obj => ((obj.supertypes.includes("Legendary") && obj.types.includes("Creature")) || obj.text && obj.text.includes("can be your commander")))

    fs.writeFileSync('./jsons/commanders.json', JSON.stringify(commanders, null, 2), { encoding: "utf8" })
  } else {
    // ------------------------------------------ MAKE DECK ------------------------------------------
    const randomColor = [
      "Faceless One",
      "Clara Oswald",
      "The Prismatic Piper",
    ]
    const commander = random(JSON.parse(fs.readFileSync('./jsons/commanders.json', { encoding: "utf8" })))
    const commanderColors = randomColor.includes(commander.name) ? choose(colors, 1) : commander.colorIdentity
    const invertedColors = colors.filter(item => !commanderColors.includes(item))
    const filtered = Object.values(JSON.parse(fs.readFileSync('./jsons/filtered.json', { encoding: "utf8" })))
    const refiltered = filtered.filter(item => (!invertedColors.map(str => item.colorIdentity.includes(str)).reduce((a,b) => a||b, false)) && item.name !== commander.name).map(item => item.name)
    const deck = choose(refiltered, 64 - (commanderColors.length === 0 ? 1 : commanderColors.length))

    // ------- PIPS ---------
    // const pips = {}
    // commanderColors.forEach(element => {
    //   pips[element] = 0
    // });
    // deck.forEach(element => {
    //   filtered[element].manaCost.replaceAll(/[^WUBRG]/g,"").split("").forEach(mana => {
    //     pips[mana] += 1
    //   })
    // });
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
      mana = mana.concat([
        "City of Brass",
        "Mana Confluence",
        "Reflecting Pool",
        ...triColors.map(type => triomeCycle[type]),
        ...dualColors.map(type => dual[type]),
        ...dualColors.map(type => shock[type]),
        ...dualColors.map(type => bond[type]),
        ...dualColors.map(type => slow[type]),
        ...dualColors.map(type => horizon[type]),
        ...choose(utility, 4 + randomInt(3)),
      ])
    } else if (commanderColors.length > 3) {
      mana = mana.concat([
        "City of Brass",
        "Mana Confluence",
        "Reflecting Pool",
        "Exotic Orchard",
        ...choose(triColors.map(type => triomeCycle[type]), 3),
        ...dualColors.map(type => dual[type]),
        ...choose(dualColors.map(type => shock[type]), 3 + randomInt(4)),
        ...choose(dualColors.map(type => bond[type]), 2 + randomInt(2)),
        ...choose(dualColors.map(type => horizon[type]), 1 + randomInt(3)),
        ...choose(utility, 2 + randomInt(3)),
      ])
    }

    mana = onlyUnique(mana)

    const basic = {
      "B": "Snow-Covered Swamp",
      "G": "Snow-Covered Forest",
      "R": "Snow-Covered Mountain",
      "U": "Snow-Covered Island",
      "W": "Snow-Covered Plains",
    }


    let basicLands = {}

    if (commanderColors.length === 0) {
      basicLands.Wastes = 36
    } else {
      for (let i = (35 + commanderColors.length) - mana.length; i > 0; i--) {
        let type = basic[random(commanderColors)]
        if (basicLands[type] === undefined) {
          basicLands[type] = 0
        }
        basicLands[type] += 1
      }
    }

    const cockatrice =
`Mainboard
${deck.map(str => `1 ${str}`).join("\n")}
${mana.map(str => `1 ${str}`).join("\n")}
${Object.keys(basicLands).map(str => `${basicLands[str]} ${str}`).join("\n")}

SideBoard
1 ${commander.name}`

    fs.writeFileSync("./jsons/cockatrice.txt", cockatrice, { encoding: "utf8" })

    const archidekt =
`${deck.map(str => `1 ${str}`).join("\n")}
${mana.map(str => `1 ${str}`).join("\n")}
${Object.keys(basicLands).map(str => `${basicLands[str]} ${str}`).join("\n")}
1 ${commander.name}[Commander{top}]`

    fs.writeFileSync("./jsons/archidekt.txt", archidekt, { encoding: "utf8" })
  }
}

run()