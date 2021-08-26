// ==UserScript==
// @name Victorian Covid-19 exposure site highlighter
// @namespace https://www.claudinec.net/
// @description Finds and highlights suburbs of interest in the Victorian Government table of Covid-19 exposure sites. Highlight colour matches exposure tier (1-3).
// @match https://www.coronavirus.vic.gov.au/exposure-site*
// @grant GM_getValue
// @grant GM_setValue
// @author Claudine Chionh <info@claudinec.net>
// @version 0.1.4
// @license GPL-3.0-or-later
// ==/UserScript==

const splitRe = /,/
const tierMatch = /Tier [0-9]/
var alertSuburbs = ['Melbourne']
var promptSuburbs = prompt('Suburbs to highlight, separated by commas', 'Melbourne')
if (promptSuburbs) {
  alertSuburbs = promptSuburbs.split(splitRe)
}

const resultsPage = document.body
const callback = function (mutations, observer) {
  for (const mutation of mutations) {
    removeStyles()
    matchSuburbs()
  }
}
const observer = new MutationObserver(callback)
observer.observe(resultsPage, { characterData: true, childList: true, subtree: true })

function matchSuburbs () {
  const suburbs = document.querySelectorAll('td[data-tid="col-suburb"]')
  suburbs.forEach(suburb => {
    const suburbName = suburb.lastElementChild.textContent
    const suburbRow = suburb.closest('tr')
    const siteTier = suburbRow.querySelector('.ch-health-advice-dropdown__title').textContent.match(tierMatch)
    if (alertSuburbs.includes(suburbName)) {
      switch (siteTier[0]) {
        case 'Tier 1':
          suburbRow.style.backgroundColor = 'orangered'
          break
        case 'Tier 2':
          suburbRow.style.backgroundColor = 'yellow'
          break
        case 'Tier 3':
          suburbRow.style.backgroundColor = 'aqua'
          break
        // no default
      }
    }
  })
}

function removeStyles () {
  const dataRows = document.querySelectorAll('tr')
  dataRows.forEach(dataRow => {
    dataRow.removeAttribute('style')
  })
}
