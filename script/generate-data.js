import yaml from 'yaml'
import { writeFileSync } from 'fs'

const SEIYUU_INFO = "https://gcore.jsdelivr.net/gh/nulla2011/sysx@master/seiyuu-info.yaml"
const main = async () => {
  const rawdata = await fetch(SEIYUU_INFO)
    .then(res => res.text())
    .catch(e => {
      console.error(e.message);
      process.exit(1)
    })
  const data = yaml.parse(rawdata)
  const fourLetterList = Object.entries(data)
    .filter(el => el[1].pysx && el[1].pysx.length === 4)
    .map(el => [el[0], el[1].pysx])
  writeFileSync('./public/data.json', JSON.stringify(fourLetterList))
}
main()