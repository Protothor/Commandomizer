export const rebuildData = async (fetchData) => {
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
  db.filter(e => e.language === "English" && e.legalities.commander === "Legal" && !e.type.includes("Land") && e.availability.includes("paper")).filter(item => {
    if (item.name.includes("//")) {
      const split = item.name.split(" // ")
      return split[0] === split[1]
    }
    return false
  }).map(({ colors, colorIdentity, manaCost, name, subtypes, supertypes, text, type, types }) => ({ colors, colorIdentity, manaCost, name, subtypes, supertypes, text, type, types })).forEach(element => { filtered[element.name] = element });

  fs.writeFileSync('./jsons/filtered.json', JSON.stringify(filtered, null, 2), { encoding: "utf8" })

  // ------------------------------------------ FILTER LAND ------------------------------------------
  const landFilter = JSON.parse(fs.readFileSync('./jsons/landFilter.json', { encoding: "utf8" }))

  const lands = {}
  db.filter(e => e.language === "English" && e.legalities.commander === "Legal" && e.type.includes("Land") && e.availability.includes("paper") && !landFilter.includes(e.name)).filter(str => {
    if (str.includes("//")) {
      const split = str.split(" // ")
      return split[0] === split[1]
    }
    return false
  }).map(({ colors, colorIdentity, manaCost, name, subtypes, supertypes, text, type, types }) => ({ colors, colorIdentity, manaCost, name, subtypes, supertypes, text, type, types })).forEach(element => { lands[element.name] = element });

  fs.writeFileSync('./jsons/lands.json', JSON.stringify(lands, null, 2), { encoding: "utf8" })
  // ------------------------------------------ MAKE COMMANDER LIST ------------------------------------------
  const commanders = Object.keys(filtered).map(key => filtered[key]).filter(obj => ((obj.supertypes.includes("Legendary") && obj.types.includes("Creature")) || obj.text && obj.text.includes("can be your commander")))

  fs.writeFileSync('./jsons/commanders.json', JSON.stringify(commanders, null, 2), { encoding: "utf8" })
}