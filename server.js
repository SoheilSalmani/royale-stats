/**
 * Base de données
 */

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// URL de connexion vers la base de données
const dbUrl = 'mongodb://127.0.0.1:27017';

// Nom de la base de données
const dbName = 'royale_stats';

// Crée un nouveau MongoClient
const client = new MongoClient(dbUrl, { useNewUrlParser: true });

const findDocuments = function (db, col, callback) {
    // Get the documents collection
    const collection = db.collection(col);
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

/**
 * Serveur
 */

const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const express = require('express');
const app = express();

// Accueil
app.get('/', function(req, res) {
    var page = "index.html";
    var params = querystring.parse(url.parse(req.url).query);

    fs.readFile(__dirname + '/src/' + page, function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading ' + page);
        }
        console.log('sending page ' + page)
        res.end(data)
    });
});

// Cartes
app.get('/cards', function(req, res) {
    var page = "cards.html";
    var params = querystring.parse(url.parse(req.url).query);

    fs.readFile(__dirname + '/src/' + page, function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading ' + page);
        }
        console.log('sending page ' + page)
        res.end(data)
    });
});

// Decks les plus populaires
app.get('/top-decks', function(req, res) {
    var page = "top-decks.html";
    var params = querystring.parse(url.parse(req.url).query);

    fs.readFile(__dirname + '/src/' + page, function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading ' + page);
        }
        console.log('sending page ' + page)
        res.end(data)
    });
});

// Meilleurs joueurs
app.get('/top-players', function(req, res) {
    var page = "top-players.html";
    var params = querystring.parse(url.parse(req.url).query);

    fs.readFile(__dirname + '/src/' + page, function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading ' + page);
        }
        console.log('sending page ' + page)
        res.end(data)
    });
});

// Meilleurs clans
app.get('/top-clans', function(req, res) {
    var page = "top-clans.html";
    var params = querystring.parse(url.parse(req.url).query);

    fs.readFile(__dirname + '/src/' + page, function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading ' + page);
        }
        console.log('sending page ' + page)
        res.end(data)
    });
});

// Informations d'un joueur
app.get('/player/*', function(req, res) {
    var page = "player.html";
    var params = querystring.parse(url.parse(req.url).query);

    fs.readFile(__dirname + '/src/' + page, function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading ' + page);
        }
        console.log('sending page ' + page)
        res.end(data)
    });
});

app.get('/*', function(req, res) {
    var page = url.parse(req.url).pathname;
    var params = querystring.parse(url.parse(req.url).query);

    fs.readFile(__dirname + '/src/' + page, function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading ' + page);
        }
        console.log('sending page ' + page)
        res.end(data)
    });
});

var port = 8080;
console.log("listening to " + port);
var io = require('socket.io').listen(app.listen(port), {log: true});

/**
 * Gestion des requêtes
 */

const request = require("request");
const token = 'your-key';

// Connexion du client
client.connect(function(err) {
    const db = client.db(dbName);

    io.sockets.on('connection', function (socket) {
        // Menu
        socket.on('menu', function (data) {
            findDocuments(db, 'menu', function (data) {
                socket.emit('menu', data);
            });
        });

        // Icônes des cartes
        socket.on('cards-icons', function (data) {
            findDocuments(db, 'cards_icons', function (data) {
                socket.emit('cards-icons', data);
            });
        });

        // Autres icônes
        socket.on('other-icons', function (data) {
            findDocuments(db, 'other_icons', function (data) {
                socket.emit('other-icons', data);
            });
        });

        // Contenu
        socket.on('content', function (data) {
            findDocuments(db, 'content', function (data) {
                socket.emit('content', data);
            });
        });

        // Constantes (cartes, etc.)
        socket.on('constants', function (data) {
            let options = { 
                method: 'GET',
                url: 'https://api.royaleapi.com/constants',
                headers: { auth: token }
            };
            
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                socket.emit('constants', body);
            });
        });

        // Decks les plus populaires
        socket.on('top-decks', function (data) {
            let options = { 
                method: 'GET',
                url: 'https://api.royaleapi.com/popular/decks',
                headers: { auth: token }
            };
            
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                socket.emit('top-decks', body);
            });
        });

        // Meilleurs joueurs
        socket.on('top-players', function (data) {
            let options = { 
                method: 'GET',
                url: 'https://api.royaleapi.com/top/players/us',
                headers: { auth: token }
            };
            
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                socket.emit('top-players', body);
            });
        });

         // Meilleurs clans
         socket.on('top-clans', function (data) {
            let options = { 
                method: 'GET',
                url: 'https://api.royaleapi.com/top/clans/us',
                headers: { auth: token }
            };
            
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                socket.emit('top-clans', body);
            });
        });

        // Informations d'un joueur
        socket.on('player', function (data) {
            let options = { 
                method: 'GET',
                url: 'https://api.royaleapi.com/player/' + data,
                headers: { auth: token }
            };
            
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                socket.emit('player', body);
            });
        });
    });
});
