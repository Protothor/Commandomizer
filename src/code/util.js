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