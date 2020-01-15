loading()

const serverUrl = "http://127.0.0.1";
const serverPort = 8080;
const server = io.connect(serverUrl + ":" + serverPort);

// Récupère les données du menu
server.emit('menu');
server.on('menu', function (data) {
    // Affiche le menu
    showMenu(data);
});

// Récupère les données des decks les plus populaires
server.emit('top-decks');
server.on('top-decks', function(data) {
    let decks = JSON.parse(data);

    // Affiche la liste des decks les plus populaires
    showDecks(decks.slice(0, 30));
    // Affiche les statistiques de popularité
    showPopularity(decks.slice(0, 30));
    // Affiche les statistiques concernant les cartes de ces decks
    showCardsUsage(decks);

    display();
});

/**
 * Affiche le menu
 */
function showMenu(data) {
    let li = d3.select("#menu")
        .selectAll('li')
        .data(data)
        .enter()
        .append('li');
    li 
        .attr('class', 'nav-item')
        .append('a')
        .attr('class', 'nav-link')
        .attr('href', function (d) { return d.href; })
        .text(function (d) { return d.label; });
    $('.form-inline button').click(function(e) {
        e.preventDefault();
        window.location.replace('/player/' + $('.navbar input').val());
    });
}

/**
 * Affiche les 30 decks les plus populaires
 */
function showDecks(decks) {
    let tbody = d3.select("#popular-decks-list").append('tbody');
    let tr = tbody.selectAll('tr')
        .data(decks)
        .enter()
        .append('tr')
    tr
        .append('th')
        .attr('scope', 'row')
        .html(function (d, i) { return "Deck #&#8239;" + (i + 1); })
    td = tr
        .append('td')

    for (let i = 0; i < 8; i++) {
        td
            .append('img')
            .attr('src', function (d) { return d["cards"][i].icon; })
            .attr('alt', function (d) { return d["cards"][i].name; });
    }
}

/**
 * Affiche les scores de popularité des decks
 */
function showPopularity(decks) {
    let max = d3.max(getPopularityValues(decks));

    let cardBody = d3.select("#decks-popularity .card-body");
    let div = cardBody.selectAll('div')
        .data(decks)
        .enter()
        .append('div');
    let h4 = div.append('h4')
        .attr('class', 'small font-weight-bold')
        .html(function (d, i) { return "Deck&#8239;#&#8239;" + (i + 1); });
    div.append('div')
        .attr('class', 'progress mb-4')
        .append('div')
        .attr('class', 'progress-bar bg-danger')
        .style('width', function (d) { return d.popularity * 100 / max + '%' })
        .attr('aria-valuenow', function (d) { return d.popularity * 100 / 92 })
        .attr('aria-valuemin', 0)
        .attr('aria-valueman', 100);
    h4.append('span')
        .attr('class', 'float-right')
        .html(function (d) { return d.popularity });
}


/**
 * Affiche les stats d'utilisation des cartes
 */
function showCardsUsage(decks) {
    let cardsUsage = getCardsUsage(decks);
    cardsUsage.sort((a,b) => (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0)); 

    let cardBody = d3.select("#cards-usage .card-body");
    let div = cardBody.selectAll('div')
        .data(cardsUsage)
        .enter()
        .append('div');
    let h4 = div.append('h4')
        .attr('class', 'small font-weight-bold')
        .text(function (d) { return d.key; });
    div.append('div')
        .attr('class', 'progress mb-4')
        .append('div')
        .attr('class', 'progress-bar bg-danger')
        .style('width', function (d) { return d.value * 100 / decks.length + '%' })
        .attr('aria-valuenow', function (d) { return d.popularity * 100 / decks.length; })
        .attr('aria-valuemin', 0)
        .attr('aria-valueman', 100);
    h4.append('span')
        .attr('class', 'float-right')
        .html(function (d) { return (Math.round((d.value * 100 / decks.length) * 10 ) / 10) + '&#8239;%' });
}

/**
 * Récupère les valeurs de popularité
 */
function getPopularityValues(decks) {
    let popularityValues = [];
    for (i = 0; i < decks.length; i++) {
        popularityValues.push(decks[i]["popularity"]);
    }
    return popularityValues;
}

/**
 * Récupère les stats d'utilisation des cartes
 */
function getCardsUsage(decks) {
    let keyToFreq = [];
    for (let i = 0; i < decks.length; i++) {
        for (let j = 0; j < 8; j++) {
            let key = decks[i]['cards'][j].name;
            keyToFreq[key]= (keyToFreq[key] || 0) + 1;
        }
    }
    let cardsUsage = [];
    Object.keys(keyToFreq).forEach(function (key) {
        let elt = { key: key, value: keyToFreq[key] };
        cardsUsage.push(elt);
    });
    return cardsUsage;
}

function loading() {
    d3.select('body').append('div')
        .attr('class', 'spinner-border')
        .attr('role', 'status')
        .style('position', 'fixed')
        .style('top', '50%')
        .style('left', '50%')
        .append('span')
        .attr('class', 'sr-only')
        .text('Loading...')
        .style('width', 200)
        .style('height', 200);
}

function display() {
    d3.select('#menu').style('opacity', 1);
    d3.select('#wrapper > *:not(:first-child)').style('opacity', 1);
    d3.select('.spinner-border').style('opacity', 0);
}