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

// Récupère les 100 premiers joueurs
server.emit('top-players');
server.on('top-players', function(data) {
    let topPlayersData = JSON.parse(data);
    showTopPlayers(topPlayersData.slice(0, 100));

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

// Affiche les 100 premiers joueurs
function showTopPlayers(data) {
    let tbody = d3.select("#top-players table").append('tbody');
    let tr = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');
    tr
        .append('td')
        .html(function(d) { return "#&#8239;" + d.rank; });
    tr
        .append('td')
        .text(function(d) { return d.name + ' ' ; })
        .append('span')
        .attr('class', 'badge badge-secondary')
        .text(function (d) { return '#' + d.tag; });
    tr
        .append('td')
        .text(function (d) { return d.trophies + ' '; })
        .append('img')
        .attr('src', otherIcons['trophy'])
        .attr('alt', 'trophies')
        .attr('width', 20)
        .attr('class', 'ml-1')
        .style('margin-bottom', '4px');
    tr
        .append('td')
        .html(function (d) {
            let r;
            if (d.clan) {
                r = d.clan.name + ' ';
                r += '<span class="badge badge-secondary">#' + d.clan.tag + '</span>';
            } else {
                r = '<i>No Clan</i>';
            }
            return '<b>Clan :</b> ' + r;
        });
    tr
        .append('td')
        .append('a')
        .attr('href', function(d) { return '/player/' + d.tag; })
        .attr('class', 'btn btn-primary')
        .text('Show Player Profile');
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