interface Tour {
  index: number,
  year: string,
  tournament: string
}

interface Player {
  index: number,
  year: string,
  player: string,
  qualifier: boolean
}

function encodeName(n: string): string {
  return n.replace(' Qualifiers', '').toLowerCase().replace(/\s/g, '_')
}

function insertTour(year: string, index: number, player, tour: string) {
  const p = {
    index: index,
    year: year,
    tournament: tour
  }
  if (playerBreaks[player] === undefined) {
    playerBreaks[player] = [p]
  } else {
    playerBreaks[player].push(p)
  }
}

function insertPlayer(year: string, index: number, player, tour: string) {
  const t = {
    index: index,
    year: year,
    player: player,
    qualifier: false
  }
  const tn = tour.replace(' Qualifiers', '')
  if (tn !== tour) {
    t.qualifier = true
  }
  if (tourBreaks[tn] === undefined) {
    tourBreaks[tn] = [t]
  } else {
    tourBreaks[tn].push(t)
  }
}


const balers = document.getElementsByClassName('baler')
let index = 0
const playerBreaks = new Map<string, Tour[]>()
const tourBreaks = new Map<string, Player[]>()

for (let i = balers.length-1; i >= 0; i--) {
  const yearEl = (balers[i].childNodes[1] as Element)
  const year = yearEl.textContent
  yearEl.id = year
  let lis = (balers[i].childNodes[3] as Element).children

  const breaksEl = document.createElement('span')
  breaksEl.appendChild(document.createTextNode(lis.length + (lis.length === 1 ? ' Break' : ' Breaks')))
  yearEl.appendChild(breaksEl)

  for (let j = lis.length-1; j >= 0; j--) {
    ++index
    // init two breaks map
    const player = (lis[j].childNodes[1] as any).textContent
    const tour = (lis[j].childNodes[3] as any).textContent
    insertTour(year, index, player, tour)
    insertPlayer(year, index, player, tour)
    
    let indexEl = document.createElement('strong')
    indexEl.appendChild(document.createTextNode(index + '.'))
    lis[j].insertBefore(indexEl, lis[j].childNodes[0])
  }
}

function fillBreaksPlayer(balerEl: HTMLElement, playerName: string, tours: Tour[]) {
  let h4El = document.createElement('h4')
  h4El.appendChild(document.createTextNode(playerName))
  h4El.id = encodeName(playerName)
  balerEl.appendChild(h4El)

  let ulEl = document.createElement('ul')
  for (let j = 0; j < tours.length; j++) {
    let li = tours[j]
    let liEl = document.createElement('li')
    let indexEl = document.createElement('strong')
    indexEl.appendChild(document.createTextNode(li.index + '.'))
    liEl.appendChild(indexEl)

    liEl.appendChild(document.createTextNode(' '))

    let tourEl = document.createElement('a')
    tourEl.setAttribute('href', '#tournaments%40' + encodeName(li.tournament))
    tourEl.appendChild(document.createTextNode(li.tournament))
    liEl.appendChild(tourEl)

    liEl.appendChild(document.createTextNode(' - '))

    let yearEl = document.createElement('a')
    yearEl.setAttribute('href', '#years%40' + li.year)
    yearEl.appendChild(document.createTextNode(li.year + ''))
    liEl.appendChild(yearEl)

    ulEl.appendChild(liEl)
  }
  balerEl.appendChild(ulEl)
}

function fillTournament(balerEl: HTMLElement, tourName: string, players: Player[]) {
  let ulEl = document.createElement('ul')
  for (let j = 0; j < players.length; j++) {
    let li = players[j]
    let liEl = document.createElement('li')
    let indexEl = document.createElement('strong')
    indexEl.appendChild(document.createTextNode(li.index + '.'))
    liEl.appendChild(indexEl)

    liEl.appendChild(document.createTextNode(' '))

    let playerEl = document.createElement('a')
    playerEl.setAttribute('href', '#breaks%40' + encodeName(li.player))
    playerEl.appendChild(document.createTextNode(li.player))
    liEl.appendChild(playerEl)

    liEl.appendChild(document.createTextNode(' - '))

    let yearEl = document.createElement('a')
    yearEl.setAttribute('href', '#years%40' + li.year)
    yearEl.appendChild(document.createTextNode(li.year + ''))
    liEl.appendChild(yearEl)

    if (li.qualifier) {
      liEl.appendChild(document.createTextNode(' Qualifiers'))
    }

    ulEl.appendChild(liEl)
  }
  balerEl.appendChild(ulEl)
}

/*
 * construct breaks
 */
((pt) => {
  const sortedPlayers = Object.keys(pt).sort((a, b) => {
    return pt[b].length - pt[a].length
  })

  const secEl = document.createElement('section')
  secEl.className = 'breaks'

  for (let i = 0; i < sortedPlayers.length; i++) {
    let sp = sortedPlayers[i]
    let balerEl = document.createElement('div')
    balerEl.className = 'baler'

    let h3El = document.createElement('h3')
    h3El.appendChild(document.createTextNode(pt[sp].length))
    let breaksEl = document.createElement('span')
    breaksEl.appendChild(document.createTextNode(pt[sp].length === 1 ? 'Break' : 'Breaks'))
    h3El.appendChild(breaksEl)
    balerEl.appendChild(h3El)

    fillBreaksPlayer(balerEl, sp, pt[sp])
    for (let j = i+1; j < sortedPlayers.length; j++) {
      if (pt[sp].length === pt[sortedPlayers[j]].length) {
        let sp = sortedPlayers[j]
        fillBreaksPlayer(balerEl, sp, pt[sp])
        i = j
      }
    }

    secEl.appendChild(balerEl)
  }

  const yearsEl = document.getElementsByClassName('years')[0]
  yearsEl.parentNode.insertBefore(secEl, yearsEl)
})(playerBreaks);

/*
 * construct tournaments
 */
((tt) => {
  const sortedTours = Object.keys(tt).sort((a, b) => {
    return tt[b].length - tt[a].length
  })

  const secEl = document.createElement('section')
  secEl.className = 'tournaments'

  for (let i = 0; i < sortedTours.length; i++) {
    let st = sortedTours[i]
    let balerEl = document.createElement('div')
    balerEl.className = 'baler'

    let h4El = document.createElement('h4')
    h4El.appendChild(document.createTextNode(st))
    h4El.id = encodeName(st)
    let breaksEl = document.createElement('span')
    breaksEl.appendChild(document.createTextNode(tt[st].length + (tt[st].length === 1 ? ' Break' : ' Breaks')))
    h4El.appendChild(breaksEl)
    balerEl.appendChild(h4El)

    fillTournament(balerEl, st, tt[st])

    secEl.appendChild(balerEl)
  }

  const yearsEl = document.getElementsByClassName('years')[0]
  yearsEl.parentNode.insertBefore(secEl, yearsEl)
})(tourBreaks)

let hash = window.location.hash
if (hash) {
  jump(hash)
} else {
  jump('#years')
}

function jump(hash: string) {
  hash = decodeURIComponent(hash)
  const splitHash = hash.split('@')
  const dimension = splitHash[0].substring(1)
  const el = document.getElementsByClassName(dimension)[0]
  const pEl = el.parentNode
  const chEls = pEl.children
  for (let i = 0; i < chEls.length; i++) {
    if (chEls[i].tagName === 'SECTION') {
      if (chEls[i] != el) {
        chEls[i].setAttribute('style', 'display:none')
        chEls[i].className = chEls[i].className.replace(' shown', '')
      } else {
        chEls[i].setAttribute('style', 'display:flex')
        setTimeout(() => {
          chEls[i].className = dimension + ' shown'
          if (splitHash.length === 2) {
            const anchorEl = document.getElementById(splitHash[1])
            const pos = anchorEl.getBoundingClientRect()
            window.scrollTo(0, pos.top + window.scrollY)
          }
        }, 100)
      }
    }
  }

  const dEl = document.getElementsByClassName('dimension-switch')[0]
  const dchEls = dEl.children
  for (let i = 0; i < dchEls.length; i++) {
    if (dchEls[i].getAttribute('href') === '#' + dimension) {
      dchEls[i].className = 'active'
    } else {
      dchEls[i].className = ''
    }
  }
}

document.addEventListener('click', function(e) {
  let href = (e.target as Element).getAttribute('href')
  if (href && href.indexOf('#') === 0) {
    jump(href)
  }
})
