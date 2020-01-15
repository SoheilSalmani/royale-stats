loading()

const serverUrl = "http://127.0.0.1";
const serverPort = 8080;
const server = io.connect(serverUrl + ":" + serverPort);

// Récupère les données du menu
server.emit('menu');
server.on('menu', function (data) {
    showMenu(data); // Affiche le menu
});

server.emit('content');
server.on('content', function (data) {
    let content = data[0]['jumbotron'];
    d3.select('.jumbotron .title').html(content['title']);
    d3.select('.jumbotron .subtitle').html(content['subtitle']);
    d3.select('.jumbotron .text').html(content['text']);
    d3.select('.jumbotron .btn').html(content.link.value)
    d3.select('.jumbotron .btn').attr('href', content.link.href);
    display()
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