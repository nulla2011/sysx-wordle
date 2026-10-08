import { readFileSync } from 'fs'

const data = JSON.parse(readFileSync('./public/data.json'))
const mergedData = new Map()
for (const el of data) {
  const key = el[1]
  const list = mergedData.get(key) ? mergedData.get(key).concat([el[0]]) : [el[0]]
  mergedData.set(key, list)
}
for (const el of mergedData.values()) {
  if (el.length > 1) {
    console.log(el);
  }
}