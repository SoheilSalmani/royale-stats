let pathArray = window.location.pathname.split( '/' );
let tag = pathArray[pathArray.length - 1];
document.title= tag + ' | Royale Stats';

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

// Récupère des icônes divers
let otherIcons;
server.emit('other-icons');
server.on('other-icons', function (data) {
    otherIcons = data[0];
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

// Récupère les informations du joueur
server.emit('player', tag);
server.on('player', function(data) {
    let playerData = JSON.parse(data);
    // Affiche les informations du joueur
    showPlayerInfos(playerData);
    // Affiche les decks du joueur
    showPlayerCards(playerData.cards);

    display();
});

/**
 * Affiche les informations du joueur
 */
function showPlayerInfos(d) {
    d3.select("#player-profile .name")
        .text(d.name)
        .append('span')
        .attr('class', 'badge badge-secondary ml-2')
        .style('position', 'relative')
        .style('top', '-4px')
        .text('#' + d.tag);

    let rank = d3.select("#player-profile .rank");
    rank
        .html('<b>Rank:</b> ' + d.rank);

    let trophies = d3.select("#player-profile .trophies");
    trophies
        .text(d.trophies)
        .append('img')
        .attr('src', otherIcons['trophy'])
        .attr('alt', "trophies")
        .attr('width', 20)
        .attr('class', 'ml-1')
        .style('margin-bottom', '4px');
    d3.select("#player-profile .arena-name").text(d.arena.name);
    d3.select("#player-profile .arena").text(d.arena.arena);

    console.log(d.clan)
    if (d.clan) {
        d3.select("#player-clan .name")
            .text(d.clan.name)
            .append('span')
            .attr('class', 'badge badge-secondary ml-2')
            .style('position', 'relative')
            .style('top', '-4px')
            .text('#' + d.clan.tag);
        d3.select("#player-clan .badge-clan")
            .append('img')
            .attr('src', d.clan.badge.image)
            .attr('alt', d.clan.badge.name);
        d3.select("#player-clan .donations").html('<b>Donations:</b> ' + d.clan.donationsReceived);
        d3.select("#player-clan .donations-received").html('<b>Donations Received:</b> ' + d.clan.donationsReceived);
    } else {
        d3.select("#player-clan").style('display', 'none');
    }

    d3.select("#player-stats .level").html('<b>Level:</b> ' + d.stats.level);
    d3.select("#player-stats .cards-found").html('<b>Cards Found:</b> ' + d.stats.cardsFound);
    d3.select("#player-stats .max-trophies").html('<b>Max Trophies:</b> ' + d.stats.maxTrophies)
        .append('img')
        .attr('src', otherIcons['trophy'])
        .attr('alt', "trophies")
        .attr('width', 20)
        .attr('class', 'ml-1')
        .style('margin-bottom', '4px');
    d3.select("#player-stats .clan-cards-collected").html('<b>Clan Cards Collected:</b> ' + d.stats.clanCardsCollected);
    d3.select("#player-stats .tournament-cards-won").html('<b>Tournament Cards Won:</b> ' + d.stats.tournamentCardsWon);
    d3.select("#player-stats .three-crown-wins").html('<b>Three Crown Wins:</b> ' + d.stats.threeCrownWins);
    d3.select("#player-stats .challenge-max-wins").html('<b>Challenge Max Wins:</b> ' + d.stats.challengeMaxWins);
    d3.select("#player-stats .challenge-cards-won").html('<b>Challenge Cards won:</b> ' + d.stats.challengeCardsWon);
    d3.select("#player-stats .total-donations").html('<b>Total Donations:</b> ' + d.stats.totalDonations);

    d3.select("#player-games .total").html('<b>Total:</b> ' + d.games.total);
    d3.select("#player-games .tournament-games").html('<b>Tournament Games:</b> ' + d.games.tournamentGames);
    d3.select("#player-games .wins").html('<b>Wins:</b> ' + d.games.wins);
    d3.select("#player-games .war-day-wins").html('<b>War Day Wins:</b> ' + d.games.warDayWins);
    d3.select("#player-games .wins-percent").html('<b>Wins Percent:</b> ' + d.games.winsPercent * 100 + "&#8239;%");
    d3.select("#player-games .losses").html('<b>Losses:</b> ' + d.games.losses);
    d3.select("#player-games .losses-percent").html('<b>Losses-Percent:</b> ' + d.games.lossesPercent * 100 + "&#8239;%");
    d3.select("#player-games .draws").html('<b>Draws:</b> ' + d.games.draws);
    d3.select("#player-games .draws-percent").html('<b>Draws Percent:</b> ' + d.games.drawsPercent * 100 + "&#8239;%");

    let currentDeck = d3.select("#player-deck .current-deck");
    for (let i = 0; i < 8; i++) {
        currentDeck
            .append('img')
            .attr('src', d["currentDeck"][i].icon)
            .attr('alt', d["cards"][i].name)
            .attr('width', 125);
    }
}

/**
 * Affiche les stats des cartes du joueur
 */
function showPlayerCards(cards) {
    cards.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)); 

    let cardBody = d3.select("#player-cards .card-body");
    let div = cardBody.selectAll('div')
        .data(cards)
        .enter()
        .append('div');
    let h4 = div.append('h4')
        .attr('class', 'small font-weight-bold')
        .text(function (d) { return d.name; });
    div.append('div')
        .attr('class', 'progress mb-4')
        .append('div')
        .attr('class', 'progress-bar bg-danger')
        .style('width', function (d) { return d.level * 100 / d.maxLevel + '%' })
        .attr('aria-valuenow', function (d) { return d.level * 100 / d.maxLevel; })
        .attr('aria-valuemin', 0)
        .attr('aria-valueman', 100);
    h4.append('span')
        .attr('class', 'float-right')
        .html(function (d) { return "Level: " + d.level + '&#8239;/&#8239;' + d.maxLevel; });
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