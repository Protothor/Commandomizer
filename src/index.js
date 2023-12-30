import fs from "fs"
import {
  processArgs,
} from "./code/util.js"
import { rebuildData } from "./code/rebuild.js"
import { buildDeck } from "./code/buildDeck.js"


const run = async () => {
  const { fetchData, rebuild } = processArgs()
  if (rebuild) {
    await rebuildData(fetchData)
  }
  const { finalDeck, basicLands, commander } = buildDeck()

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
