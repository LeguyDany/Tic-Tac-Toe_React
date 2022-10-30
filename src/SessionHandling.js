import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import './index.css';
import axios from 'axios';

export function SingleSession() {
    // PLay a match locally

    const [turn, setTurn] = useState("player1");
    const [gridLength, setGridLength] = useState(3);
    const [grid, setGrid] = useState([]);
    const [winner, setWinner] = useState();

    const updateCell = (e) => {
        if (winner) { return true; }
        let cell = e.target.id.split(",").map(string => { return Number(string) });
        if (grid[cell[0]][cell[1]] === "X" || grid[cell[0]][cell[1]] === "O") { return false; };

        grid[cell[0]][cell[1]] = turn === "player1" ? "X" : "O";
        setTurn(turn === "player1" ? "player2" : "player1");
        checkFinish();
    }
    const checkFinish = () => {
        // Shows the possible answers for a win for any player
        // Time complexity: O(n^2 + 2n)

        let winner = "none";
        const isX = (value) => value === "X";
        const isO = (value) => value === "O";

        // Check rows
        for (let row = 0; row < grid.length; row++) {
            if (grid[row].every(isX)) {
                winner = "X";
                break;
            }
            if (grid[row].every(isO)) {
                winner = "O";
                break;
            }
        }

        // Check columns
        for (let col = 0; col < grid.length; col++) {
            let columnCheck = [];
            for (let cell = 0; cell < grid.length; cell++) {
                columnCheck.push(grid[cell][col]);
            }
            if (columnCheck.every(isX)) {
                winner = "X";
                break;
            }
            if (columnCheck.every(isO)) {
                winner = "O";
                break;
            }
        }


        // Check diagonals
        let diagonalCheck1 = [];
        let diagonalCheck2 = [];
        for (let cell = 0; cell < grid.length; cell++) {
            diagonalCheck1.push(grid[cell][cell]);
            diagonalCheck2.push(grid[grid.length - 1 - cell][cell]);
        }
        if (diagonalCheck1.every(isX)) { winner = "X"; }
        if (diagonalCheck1.every(isO)) { winner = "O"; }

        if (diagonalCheck2.every(isX)) { winner = "X"; }
        if (diagonalCheck2.every(isO)) { winner = "O"; }

        giveWin(winner);
    }
    const giveWin = (winner) => {
        // Gives the win to the player who has achieve one of the configurations shown in checkResult.
        if (winner === "none") { return false; }
        setWinner(winner);
        return true;
    }

    return (
        <section className="grid">
            <div>
                <label target="SizeSetter">Set size</label>
                <input name="SizeSetter" type="number" onChange={(e) => setGridLength(e.target.value)} min="2" max="15" />
                <p>Winner: {winner}</p>
            </div>
            <Grid gridLength={gridLength} setGrid={setGrid} setWinner={setWinner} grid={grid} updateCell={updateCell} />
        </section>
    )
}

export function MultiSession() {
    // Manages a 2 session game.

    const params = useParams();
    const [gridLength, setGridLength] = useState(3);
    const [grid, setGrid] = useState([]);
    const [turn, setTurn] = useState();
    const [winner, setWinner] = useState();
    const [player1, setPlayer1] = useState();
    const [player2, setPlayer2] = useState();

    const updateCell = async (e) => {
        // Updates the content of the grid upon clicking on a cell.

        // === Fetch some data and see if the 2nd player joined the game before being able to play. ===
        const url = `http://localhost:4000/api/game/${params["token"]}`;
        // Attaches a header onto the request, to identify in the back-end who is sending the mssage (if it's the player 1 or 2)
        axios.defaults.headers.common['Authorization'] = `Bearer ` + localStorage.getItem("token");
        const cell = e.target.id.split(",").map(string => { return Number(string) });
        const res = await axios.get(url);
        if (res.data === "Waiting for a 2nd player...") {
            return false;
        }

        // === Sends the information of which grid has been clicked on and then updates the content on the screen===
        const data = {
            cell: cell,
            grid: grid,
        }
        const res2 = await axios.put(url, data);
        switch (res2.data.message) {
            case "nope":
                return false;
            case "Not your turn.":
                return false;
            case "It's not your turn yet.":
                return false;
            case player1:
                setWinner(player1);
                return false;
            case player2:
                setWinner(player2);
                return false;
            default:
                setGrid(res2.data.grid);
        }

    }

    const changeGridSize = async (e) => {
        if (e.target.value < 1) { e.target.value = 2; }
        else if (e.target.value > 15) { e.target.value = 15; }
        setGridLength(e.target.value);
        const url = `http://localhost:4000/api/game/changeGrid/${params["token"]}`;
        const res = await axios.put(url, { gridLength: e.target.value });
    }

    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = `Bearer ` + localStorage.getItem("token");
        const update = async () => {
            const url = `http://localhost:4000/api/game/${params["token"]}`;
            const res = await axios.get(url);
        }
        setInterval(async () => {
            const url2 = `http://localhost:4000/api/game/`;
            const res2 = await axios.get(url2);
            setPlayer1(res2.data.player1);
            setPlayer2(res2.data.player2);
            setTurn(res2.data.turn);
            setWinner(res2.data.winner);
            if (res2.data.grid) { setGrid(res2.data.grid) }
        }, 1000);
        update();
    }, []);

    return (
        <section className="grid">
            <input className="CTA" type="button" value="Copy the room's code to the clipboard" onClick={e => { navigator.clipboard.writeText(params["token"]) }} />
            <p>
                Player 1(X): {player1}<br />
                Player 2(O): {player2}<br />
                Current turn: {turn}
            </p>

            <div>
                <label target="SizeSetter">Set size</label>
                <input name="SizeSetter" type="number" onChange={(e) => changeGridSize(e)} min="2" max="15" />
                <p>Winner: {winner}</p>
            </div>
            <Grid gridLength={gridLength} setGrid={setGrid} setWinner={setWinner} grid={grid} updateCell={updateCell} />
        </section>
    )
}

function Grid(props) {
    // Draws a grid on which we can play tic tac toe.

    const makeGrid = () => {
        // Creates a new grid with a bidimensional array
        // Time complexity: O(2n)
        let thisGrid = [];
        let row = [];

        for (let i = 0; i < props.gridLength; i++) {
            row.push(" ");
        }
        for (let i = 0; i < props.gridLength; i++) {
            thisGrid.push([...row]);
        }

        props.setGrid(thisGrid);
    }

    useEffect(() => {
        makeGrid();
        props.setWinner();
    }, [props.gridLength]);

    return (
        <article>
            {props.grid.map((element, colIndex) => (
                <div key={colIndex + "div"}>
                    {element.map((cell, rowIndex) => (
                        <input className="cell" type="submit" value={props.grid[colIndex][rowIndex]} key={colIndex + ", " + rowIndex}
                            onClick={e => { props.updateCell(e) }} id={colIndex + "," + rowIndex} />
                    ))}
                    <br key={colIndex + ", br"} />
                </div>
            ))}
        </article>
    )
}

export function HostSession() {
    // Page with 2 forms: 1 for hosting a game, the other for joining a game.

    const navigate = useNavigate();
    const [player1, setPlayer1] = useState();
    const [player2, setPlayer2] = useState();
    const [gameToken, setGameToken] = useState();
    const [gameLink, setGameLink] = useState();

    const handleSubmitHost = async (e) => {
        e.preventDefault();
        const data = {
            player1: player1,
        }
        const url = "http://localhost:4000/api/game";
        const res = await axios.post(url, data);

        axios.defaults.headers.common['Authorization'] = `Bearer ` + res.data.token;

        const gameURL = "/Multi/Game/" + res.data.token;
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ` + localStorage.getItem("token");
        setGameLink(React.createElement("a", { href: gameURL, className:"roomLink" }, "Game created, click here to join."));
    }
    const handleSubmitJoin = async (e) => {
        e.preventDefault();
        const data = {
            player2: player2,
            token: gameToken
        }
        try {
            const url = "http://localhost:4000/api/game/join"
            const res = await axios.post(url, data);
            localStorage.setItem("token", res.data.token);
            axios.defaults.headers.common['Authorization'] = localStorage.getItem("token");
            navigate("/Multi/Game/" + gameToken);
        } catch (error) {
            setGameLink(React.createElement("p", {}, "Game doesn't exists."));
        }
    }

    return (
        <section className="setMulti">
            <form onSubmit={(e) => handleSubmitHost(e)}>
                <legend>Host a game</legend>
                <div>
                    <label target="player1">Player Name</label> <br />
                    <input name="player1" id="player1" type="text" onChange={e => setPlayer1(e.target.value)} required /> <br />
                </div>
                <input className="CTA" type="submit" value="Create room" />
                {gameLink}
            </form>
            <form onSubmit={(e) => handleSubmitJoin(e)}>
                <legend>Join a game</legend>
                <div>
                    <label target="player2">Player Name</label> <br />
                    <input name="player2" id="player2" type="text" onChange={e => setPlayer2(e.target.value)} required /> <br />
                </div>
                <div>
                    <label target="room">Room's code</label> <br />
                    <input name="room" id="room" type="text" onChange={e => setGameToken(e.target.value)} required /> <br />
                </div>

                <input className="CTA" type="submit" value="Join room" />
            </form>

        </section>
    )
}