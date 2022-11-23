// ====================================================== Notice ======================================================

// This page is in deep relation with the controller file. This page will manage all the queries needed, through
// PostgreSQL command lines.

// ====================================================== Queries ======================================================

// -------------------------- adds a new player --------------------------
const addGame = `INSERT INTO game (game_id, player1, grid, date, turn) VALUES ($1, $2, $3, $4, $5);`;
const addUID = `SELECT uuid_generate_v4();`;
const setPlayer2 =  `UPDATE game SET player2=$2, turn=$3 WHERE game_id = $1;`;

// -------------------------- updates the game's state --------------------------
const updateGame = `
UPDATE game
SET turn=$2, grid=$3, winner=$4
WHERE game_id = $1;
`;

// -------------------------- returns the game's state --------------------------
const getGameState = `SELECT * FROM game WHERE game_id = $1`;

// ====================================================== Exports ======================================================
module.exports = {
    addGame,
    addUID,
    updateGame,
    getGameState,
    setPlayer2
}