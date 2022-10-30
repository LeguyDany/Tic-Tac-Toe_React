const addGame = `INSERT INTO game (game_id, player1, grid, date, turn) VALUES ($1, $2, $3, $4, $5);`;
const addUID = `SELECT uuid_generate_v4();`;
const setPlayer2 =  `UPDATE game SET player2=$2, turn=$3 WHERE game_id = $1;`;
const updateGame = `
UPDATE game
SET turn=$2, grid=$3, winner=$4
WHERE game_id = $1;
`;
const getGameState = `SELECT * FROM game WHERE game_id = $1`;

module.exports = {
    addGame,
    addUID,
    updateGame,
    getGameState,
    setPlayer2
}