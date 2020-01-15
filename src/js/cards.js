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

// Récupère les icônes des cartes
let cardsIcons;
server.emit('cards-icons');
server.on('cards-icons', function (data) {
    cardsIcons = data[0];
});

// Récupère des icônes divers
let otherIcons;
server.emit('other-icons');
server.on('other-icons', function (data) {
    otherIcons = data[0];
});

// Récupère les données des cartes
server.emit('constants');
server.on('constants', function(data) {
    let constants = JSON.parse(data);
    let cards = constants['cards'];
    cards.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
    let rarityStats = getRarityStats(cards);
    let typeStats = getTypeStats(cards);

    // Affiche toutes les cartes
    showAllCards(cards);
    // Affiche les stats de rareté des cartes
    showRarityStats(cards, rarityStats);
    // Affiche les stats de type des cartes
    showTypeStats(cards, typeStats);

    display();
});

/**
 * Renvoie un tableau contenant les stats de rareté des cartes
 */
function getRarityStats(cards) {
    let rarityFreq = [];
    for (let i = 0; i < cards.length; i++) {
        let key = cards[i]['rarity'];
        rarityFreq[key] = (rarityFreq[key] || 0) + 1;
    }
    let rarityStats = [];
    rarityStats.push({ key: 'Common', value: rarityFreq['Common'] });
    rarityStats.push({ key: 'Rare', value: rarityFreq['Rare'] });
    rarityStats.push({ key: 'Epic', value: rarityFreq['Epic'] });
    rarityStats.push({ key: 'Legendary', value: rarityFreq['Legendary'] });
    return rarityStats;
}

/**
 * Renvoie un tableau contenant les stats de type des cartes
 */
function getTypeStats(cards) {
    let typeFreq = [];
    for (let i = 0; i < cards.length; i++) {
        let key = cards[i]['type'];
        typeFreq[key] = (typeFreq[key] || 0) + 1;
    }
    let typeStats = [];
    typeStats.push({ key: 'Troop', value: typeFreq['Troop'] });
    typeStats.push({ key: 'Spell', value: typeFreq['Spell'] });
    typeStats.push({ key: 'Building', value: typeFreq['Building'] });
    return typeStats;
}

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
 * Affiche toutes les cartes
 */
function showAllCards(cards) {
    let tbody = d3.select("#all-cards table").append('tbody');
    let tr = tbody.selectAll('tr')
        .data(cards)
        .enter()
        .append('tr');
    tr
        .append('td')
        .append('img')
        .attr('src', function (d) { return cardsIcons[d.key]; })
        .attr('alt', function (d) { return d.name; })
        .attr('height', function(d) { return 75; });
    tr
        .append('th')
        .attr('scope', 'row')
        .text(function (d) { return d.name; });
    tr
        .append('td')
        .text(function (d) { return d.elixir + ' '; })
        .append('img')
        .attr('src', otherIcons['elixir'])
        .attr('alt', "Elixir")
        .attr('height', '20');
    tr
        .append('td')
        .text(function (d) { return d.type; });
    tr
        .append('td')
        .html(function (d) { return d.rarity + '<br />'; })
        .append('img')
        .attr('src', function (d) { return otherIcons[d.rarity.toLowerCase()]; })
        .attr('alt', function (d) { return d.rarity; })
        .attr('height', '20');
    tr
        .append('td')
        .text(function (d) { return d.arena; });
    tr
        .append('td')
        .attr('class', 'text-justify')
        .text(function (d) { return d.description; });
}

/**
 * Affiche les stats de rareté des cartes
 */
function showRarityStats(cards, rarityStats) {
    let cardBody = d3.select("#rarity-stats .card-body");
    let div = cardBody.selectAll('div')
        .data(rarityStats)
        .enter()
        .append('div');
    let h4 = div.append('h4')
        .attr('class', 'small font-weight-bold')
        .text(function (d) { return d.key; });
    div.append('div')
        .attr('class', 'progress mb-4')
        .append('div')
        .attr('class', 'progress-bar bg-danger')
        .style('width', function (d) { return d.value * 100 / 92 + '%' })
        .attr('aria-valuenow', function (d) { return d.value * 100 / 92 })
        .attr('aria-valuemin', 0)
        .attr('aria-valueman', 100);
    h4.append('span')
        .attr('class', 'float-right')
        .html(function (d) { return d.value + '&#8239;/&#8239;' + cards.length });
}

/**
 * Affiche les stats de type des cartes
 */
function showTypeStats(cards, typeStats) {
    let cardBody = d3.select("#type-stats .card-body");
    let div = cardBody.selectAll('div')
        .data(typeStats)
        .enter()
        .append('div');
    let h4 = div.append('h4')
        .attr('class', 'small font-weight-bold')
        .text(function (d) { return d.key; });
    div.append('div')
        .attr('class', 'progress mb-4')
        .append('div')
        .attr('class', 'progress-bar bg-danger')
        .style('width', function (d) { return d.value * 100 / 92 + '%' })
        .attr('aria-valuenow', function (d) { return d.value * 100 / 92 })
        .attr('aria-valuemin', 0)
        .attr('aria-valueman', 100);
    h4.append('span')
        .attr('class', 'float-right')
        .html(function (d) { return d.value + '&#8239;/&#8239;' + cards.length });
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
    d3.selectAll('#wrapper > *:not(:first-child)').style('opacity', 1);
    d3.select('.spinner-border').style('opacity', 0);
}