const ROW = 3;
const MID = 4;
const GRID = 9;

function start() {
    let player = {
        name: "",
        token: "",
        cpu: "",
        first: false,
        record: {
            win: 0,
            loss: 0,
            draw: 0
        }
    }

    player = intro(player);

    game(player);
}
function intro(player) {
    const prompt = require("prompt-sync")();

    player.name = prompt("Welcome to a fun game of Tic-Tac-Toe. What is your name? ");

    coinToss(player);
    
    console.log("These numbers represents the grid locations\n");
    printBoard([1,2, 3, 4, 5, 6, 7, 8, 9]);
    console.log();

    player.token = prompt("Would you like to play as X or O? ");
    let regTok = /X|O/i;
    while (!regTok.test(player.token)) {
        console.log("That's not a playable token. Try again");
        player.token = prompt("Would you like to play as X or O? ");
    }
    player.token = player.token.toUpperCase();

    switch(player.token) {
        case 'X':
            player.cpu = 'O';
            break;
        case 'O':
            player.cpu = 'X';
            break;
    }
    return player;
}

function coinToss(player) {
    const prompt = require("prompt-sync")();
    const input = prompt(`${player.name}, heads or tails? `);

    let reg = /Heads|Tails|h|t/i;
    let coin = input.toLowerCase();

    while (!reg.test(coin)) {
        coin = prompt("I don't know what you're doing but I'm trying to flip a coin! Heads or Tails? ");
    }
    if (reg.test(input)) {
        if (Math.floor(Math.random() * 2) % 2 == 0 && coin == "heads") {
            player.first = true;
            console.log(`Congratulations ${player.name}. You get to go first!`)
        }
        else {
            player.first = false;
            console.log("Sorry CPU goes first");
        }
    }
    return player;
}

function game(player) {
    let board = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    board = board.fill(" ");
    let turn = 1;

    const prompt = require("prompt-sync")();
    let playAgain = "";

    let temp = playGame(board, player, turn);
    switch (temp) {
        case 'W':
            player.record.win++;
            break;
        case 'L':
            player.record.loss++;
            break;
        case 'D':
            player.record.draw++;
            break;
    }
    console.log(`Your record is ${player.record.win}-${player.record.loss}-${player.record.draw}`);
    playAgain = prompt("Would you like to play again? Y/N ");
    if (playAgain == 'Y' || playAgain == 'y') {
        coinToss(player);
        game(player);
    }
    else {
        console.log("Thanks for playing!");
    }
}

function playGame(board, player, turn) {
    
    if (!player.first && turn == 1) {
        board[MID] = player.cpu;
    }
    const prompt = require("prompt-sync")();

    let loc = -1;

    do {
        console.log(`This is turn: ${turn}`);
        printBoard(board)
        do {
        loc = prompt("Choose a location ");
        if (board[loc] == " ") {
            console.log("Not a valid spot. Try again");
        }
        loc--;
        } while(board[loc] != " ");
        console.log(player.token);
        board[loc] = player.token;
        let temp = Math.floor(Math.random() * 10);
        if (gameEnd(board) == "") {
            while(board[temp] != " ") {
               temp = Math.floor(Math.random() * 10);
            }
            board[temp] = player.cpu;
        }
        turn++;
    } while (gameEnd(board) == "" && turn < 5)

    printBoard(board);
    if (gameEnd(board) == player.token) {
        console.log("Congratulations! You win!")
        return 'W';
    }
    else if (gameEnd(board) == player.cpu){
        console.log("You lose! Try again next time")
        return 'L'
    }
    else {
        console.log("Draw! Wow close one!")
        return 'D'
    }
}

function gameEnd(board) {
    for (let i = 0; i < ROW; ++i) {
        if (board[0 + ROW * i] == board[1 + ROW * i] && board[0 + ROW * i] == board[2 + ROW * i]) {
            if (board[0 + ROW * i] != " " && board[2 + ROW * i] != " ") {
                return board[0 + ROW * i]
            }
        }
        if (board[i] == board[i + ROW] && board[i] == board[i + (ROW * 2)]) {
            if (board[i] != " " && board[i + (ROW * 2)] != " ") {
                return board[i];
            }
        }
        if (i == 0) {
            if (board[i] == board[i + MID] && board[i] == board[i + (MID * 2)]) {
                if (board[i] != " " && board[MID * 2] != " ") {
                   return board[i];
                }
            }
        }
        else if (i == 2) {
            if (board[i] == board[i + (MID / 2)] && board[i] == board[i + MID]) {
                if (board[0] != " " && board[1] != " " && board[2] != " ") {
                    return board[i];
                }
            }
        }
    }
    return "";
}

function printBoard(arr) {
    let temp = "   "
    for (let i = 0; i < arr.length; ++i) {
        temp += arr[i] + "   |   ";
        if ((i + 1) != arr.length && (i + 1) % 3 == 0) {
            temp += "\n------------------------\n   "
        }
    }
    console.log(temp);
}

start();