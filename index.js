const axios = require('axios')
const cheerio = require('cheerio')
//items.json cointains array of links to search. example link: "https://www.morele.net/wyszukiwarka/?q={manufacturer's code}"
const items = require('./items.json')
const chalk = require('chalk')
chalk.level = 1

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

console.log(chalk.red('Rozpoczynam pobieranie...'))
someFunction()
  .then((results) => {
    console.log(chalk.magenta('Pobrano zawartość wszystkich linków'))
    results.forEach((element) => {
      const toSeach = element.config.url.split('/?q=')[1]
      const $ = cheerio.load(element.data)
      $('.productLink').each((index, obj) => {
        const urlToItem = $(obj).attr('href')
        const name = $(obj).text()

        if (name.includes(toSeach)) {
          console.log(
            chalk.red(`Znaleziono:`),
            chalk.blue(`https://morele.net${urlToItem}`),
          )
        }
      })
    })
  })
  .catch((err) => {
    console.log(err)
  })

async function someFunction() {
  let promises = []
  for (let i = 0; i < items.length; i++) {
    promises.push(axios.get(items[i]))
    console.log(chalk.red('Pobieranie:'), chalk.green(`${items[i]}...`))
    //wait 600ms to avoid rate limit. You can try to shorten this time
    await sleep(600)
  }
  return Promise.all(promises)
}
