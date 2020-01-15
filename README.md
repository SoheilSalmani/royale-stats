# Royale Stats

A website to visualize statistical data from Clash Royale. The website uses RoyaleAPI.

**Note:** The endpoint `/popular/decks` has been removed in RoyaleAPI v3. As a result, the *Top Decks* section no longer displays anything. In addition, we have limited the retrieved data on US players since the API no longer retrieves global data.

## Import the website data into MongoDB

Data that does not come from RoyaleAPI is stored in JSON files (in the `src/json/` directory). To import them in MongoDB, use the following commands :

```
$ mongoimport --db=royale_stats --collection=menu --file=menu.json --jsonArray --maintainInsertionOrder
$ mongoimport --db=royale_stats --collection=content --file=content.json
$ mongoimport --db=royale_stats --collection=cards_icons --file=cards-icons.json
$ mongoimport --db=royale_stats --collection=other_icons --file=other-icons.json
```

## Use your RoyaleAPI developer key

Insert your RoyaleAPI developer key in the `server.js` file, line 150 :

```javascript
const token = 'your-key';
```

## Screenshots

![Home page](https://github.com/SoheilSalmani/royale-stats/blob/master/screenshots/home.png)
![Cards page](https://github.com/SoheilSalmani/royale-stats/blob/master/screenshots/cards.png)
![Top Players page](https://github.com/SoheilSalmani/royale-stats/blob/master/screenshots/top-players.png)
![Top Clans page](https://github.com/SoheilSalmani/royale-stats/blob/master/screenshots/top-clans.png)
![Random player page](https://github.com/SoheilSalmani/royale-stats/blob/master/screenshots/random-player.png)
