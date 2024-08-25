// add class x-turn or o-turn to the span
let turn = true;

// Check if i first time enter the game or i reset the game
if(localStorage.getItem("First_Player") == "null" || localStorage.getItem("First_Player") == null) {
    // Get the names of two players
    let firstPlayer = prompt("Enter Name of First Player: ");
    let secondPlayer = prompt("Enter Name of Second Player: ");

    if(firstPlayer == "")  firstPlayer = "Unknown";
    if(secondPlayer == "")  secondPlayer = "Unknown";
    
    // Add Players to local storage and there points
    localStorage.setItem("First_Player", firstPlayer);
    localStorage.setItem("Second_Player", secondPlayer);

    localStorage.setItem("First_Player_Points", 0);
    localStorage.setItem("Second_Player_Points", 0);
    
    document.querySelector(".first-player .name").innerHTML = `${firstPlayer}: `;
    document.querySelector(".second-player .name").innerHTML = `${secondPlayer}: `;

    window.location.reload();
} else {
    // get the values of local storage and add it to the page
    document.querySelector(".first-player .name").innerHTML = `${localStorage.getItem("First_Player")}: `;
    document.querySelector(".second-player .name").innerHTML = `${localStorage.getItem("Second_Player")}: `;

    document.querySelector(".first-player .cnt").innerHTML = `${localStorage.getItem("First_Player_Points")}`;
    document.querySelector(".second-player .cnt").innerHTML = `${localStorage.getItem("Second_Player_Points")}`;
}


function generateBoxes() {
    // add boxes to the game
    for(let i = 1; i <= 3; i++) {
        for(let j = 1; j <= 3; j++) {
            let box = document.createElement("div");
            box.className = `box-${i}${j}`;
            
            let createSpan = document.createElement("span");
            createSpan.innerHTML = " ";
            box.appendChild(createSpan);

            document.querySelector(".game").appendChild(box);
        }
    }

    // Draw the x-o in the boxes
    let boxes = document.querySelectorAll(".game > div");
    boxes.forEach(box => {
        box.addEventListener("click", draw);
    });
}

function draw(e) {
    // Take turns
    if(turn) {
        document.querySelector(`.${e.target.className} span`).className = "x-turn";
        document.querySelector(`.${e.target.className} span`).innerHTML = "x";

        e.target.className = `${e.target.className} no-clicking`;
    } else {
        document.querySelector(`.${e.target.className} span`).className = "o-turn";
        document.querySelector(`.${e.target.className} span`).innerHTML = "o";

        e.target.className = `${e.target.className} no-clicking`;
    }
    
    turn = !turn;

    game();

    // if any one won and pressed playagain, it will reload the page
    let btn = document.querySelector(".win button");
    if(btn)  btn.addEventListener("click", () => window.location.reload());
}

function game() {
    let draw = 1;
    let winDigX = 0, winRevDigX = 0;
    let winDigO = 0, winRevDigO = 0;

    for(let i = 1; i <= 3; i++) {
        let winColX = 0, winRowX = 0;
        let winColO = 0, winRowO = 0;

        for(let j = 1; j <= 3; j++) {
            // check if win by column
            if(document.querySelector(`.box-${i}${j} span`).innerHTML === 'x')
                winColX++;
            else if(document.querySelector(`.box-${i}${j} span`).innerHTML === 'o')
                winColO++;

            // check if win by row
            if(document.querySelector(`.box-${j}${i} span`).innerHTML === 'x')
                winRowX++;
            else if(document.querySelector(`.box-${j}${i} span`).innerHTML === 'o')
                winRowO++;

            // check if win by reversed diagonal
            if(i + j == 4 && document.querySelector(`.box-${i}${j} span`).innerHTML == 'x')
                winRevDigX++;
            else if(i + j == 4 && document.querySelector(`.box-${i}${j} span`).innerHTML == 'o')
                winRevDigO++;
        }

        if(winColX == 3 || winRowX == 3)    win("First_Player", "win"), draw = 0;
        if(winColO == 3 || winRowO == 3)    win("Second_Player", "win"), draw = 0;

        // check if win by diagonal
        if(document.querySelector(`.box-${i}${i} span`).innerHTML == 'x')
            winDigX++;
        else if(document.querySelector(`.box-${i}${i} span`).innerHTML == 'o')
            winDigO++;
    }

    if(winDigX == 3 || winRevDigX == 3) win("First_Player", "win"), draw = 0;
    if(winDigO == 3 || winRevDigO == 3) win("Second_Player", "win"), draw = 0;

    if(draw)    tie();
}

function win(a, b) {
    // get the points from local storage
    localStorage.setItem(`${a}_Points`, parseInt(localStorage.getItem(`${a}_Points`)) + 1);

    let win = document.createElement("div");
    win.className = "win";
    
    // make button Play again
    let btn = document.createElement("button");
    btn.innerHTML = "Play Again";
    win.appendChild(btn);

    document.querySelector("body").appendChild(win);

    let aWin = document.createElement("div");

    // check if draw then return draw else return the value from local storage
    if(a == "") aWin.innerHTML = b;
    else    aWin.innerHTML = `${localStorage.getItem(a)} ${b}`;

    win.appendChild(aWin);
}

function tie() {
    let completed = document.querySelectorAll(".no-clicking");
    if(completed.length == 9)   win("", "Draw");
}

let Reset = document.querySelector(".reset button");
Reset.addEventListener("click", reset);

function reset() {
    localStorage.clear();
    window.location.reload();
}

window.onload = function() {
    generateBoxes();
};