export const shuffle = (items) => {
  return items.sort(() => (Math.random() > .5) ? 1 : -1);
}

export const choose = (items, number) => {
  let x = []
  let rand = shuffle(items)
  for (let i = number; i > 0; i--) {
    x = x.concat([rand.pop()])
    rand = shuffle(rand)
  }
  return x
}

export const randomInt = (max) => {
  return Math.floor(Math.random() * max);
}

export const random = (items) => {
  return items[Math.floor(Math.random()*items.length)]
}

export const filterUnique = (value, index, array) => {
  return array.indexOf(value) === index && value !== null && value !== undefined;
}

export const onlyUnique = (array) => array.filter(filterUnique)

export const sortUniqueString = (string) => onlyUnique(string.split("").sort()).join("")

export const colors = ["B", "G", "R", "U", "W"]

export const processArgs = () => {
  const fetchData = process.argv.includes("--fetch")
  const rebuild = process.argv.includes("--rebuild")
  return {
    fetchData,
    rebuild
  }
}

export const remove = (array, rm) => {
  rm.forEach(e => {
    array.splice(array.indexOf(e), 1)
  });
  return array
}

export const addMana = (pips, manaPips) => {
  const pipsTotal = Object.values(pips).reduce((acc, val) => acc + val, 0)
  const pipsPercent = {}
  for (const key in pips) {
    pipsPercent[key] = pips[key] / pipsTotal
  }

  const manaTotal = Object.values(manaPips).reduce((acc, val) => acc + val, 0) + 1
  const difference = {}
  for (const key in manaPips) {
    const localManaPips = {...manaPips}
    localManaPips[key] += 1
    const localManaPercent = {}
    for (const localKey in localManaPips) {
      localManaPercent[localKey] = (localManaPips[localKey] / manaTotal)
    }
    difference[key] = Object.keys(manaPips).reduce((acc, localKey) => acc + Math.abs(pipsPercent[localKey] - localManaPercent[localKey]), 0)
  }
  let propertyToAdd
  let smallest = Infinity
  for(const key in difference) {
    if (difference[key] < smallest) {
      smallest = difference[key]
      propertyToAdd = key
    }
  }
  return propertyToAdd
}