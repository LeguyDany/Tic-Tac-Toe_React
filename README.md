
# Tic-Tac-Toe in React

This mini-project was made to demonstrate my skills using not only React, but also PostgreSQL, ExpressJS and NodeJS. This mini-project was done within 3 days.


## Features
- This tic-tac-toe can evolve from a 3x3 grid to a 4x4, 5x5 or more on a whim, just by pressing a button (even during an unfinished game or an online game). 
- You can host and join a game to play it online, or play it locally. The website basically creates a room once you host a new game, which can be joined by anyone with whom you've shared your room's code if you want to play it online.

## Authors

- [@LeguyDany](https://github.com/LeguyDany)
## Installation

Once you've pulled the project, follow the instructions below.

In a terminal, move to the project, then install all the depedencies:
```bash
  npm i
```

Create a new PostgreSQL database and then import into it what's in the "./Database" directory.

Go to the "./api_rest" directory, go to the db.js file then set your database:
```js
const Pool = require('pg').Pool;

const pool = new Pool({
    user:'danyleguy',
    host: 'localhost',
    database: 'JobSpark',
    password: 'HxnE4jP#k*eTxmpBzD@9',
    port: 5432,
});

module.exports = pool;
```


## Run Locally

Go to the project directory with your terminal.

```bash
  cd my-project
```

Start the server

```bash
  npm run dev
```

Run react in another terminal.

```bash
  npm start
```

## Screenshots
### Local game

![App Screenshot](https://snipboard.io/txmzMV.jpg)


### Local Game: Changing the grid size

![App Screenshot](https://snipboard.io/2Li613.jpg)

### Play online: create / joining a game

![App Screenshot](https://snipboard.io/wGsxfY.jpg)

### Exemple of online play

![App Screenshot](https://snipboard.io/sUTMkY.jpg)

