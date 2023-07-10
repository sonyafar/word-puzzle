// global variables
var words = ['milk', 'oats', 'cheese', 'butter', 'sugar', 'bread', 'jam', 'fish', 'sausage', 'ham', 'steak'];
var selectedWord = "";
const letters = document.getElementById('letters');
const hints = document.getElementById('hints');
const colors = [
    "#90D68E", // green
    "#FFDB80", // yellow
    "#E0B9F3", // purple
    "#FF9A9A", // coral
    "#A3E0FB", // blue
    "#B1C5F9" // violet
];

const solve_btn = document.querySelector('.solve-btn');

window.onload = () => {
    addEventListeners();
    startGame();
}




function startGame() {
    clearGame();
    getHints();
    arrangeLetters();
}

function arrangeLetters() {
    for(let i = 0; i < 10; i++) {
        for(let j = 0; j < 10; j++) {
            const letter = document.createElement('li');
            letter.setAttribute('data-row', i);
            letter.setAttribute('data-column', j);
            letter.className = 'letter';

            letters.appendChild(letter);
        }
    }


    arrangeFullWords(words);
    addRandomLetters();
}


function getHints() {
    // const hints = document.getElementById('hints');
    words.forEach(el => {
        const word = document.createElement('p');
        word.className = 'word';
        word.innerText = el;
        word.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        hints.appendChild(word);
    })
}

function arrangeFullWords(words) {
    let letterPositions = [ 'row', 'column', 'diagonal'];
    var tempWords = [];

    words.forEach((word, i) => {
        let orientationId = Math.floor(Math.random() * letterPositions.length);
        let orientation = letterPositions[orientationId];
    
        let letterElements = document.querySelectorAll('.letter');

        let startIndex = Math.floor(Math.random() * letterElements.length);
        let newStartIndex = 0;
    
        let rowIndex = Math.floor(startIndex / 10);
        let columnIndex  = Math.floor(startIndex % 10);
    
        let startLetter = document.querySelector(`[data-row="${0}"]` + `[data-column="${0}"]`);

        switch(orientation) {
            case 'row': {
                if(columnIndex + word.length > 10) {
                    columnIndex = 10 - word.length; 
                }
                break;
            }
            case 'column': {
                if(rowIndex + word.length > 10) {
                    rowIndex = 10 - word.length; 
                }
                break;
            }
            case 'diagonal': {
                if(rowIndex + word.length > 10) {
                    rowIndex = 10 - word.length; 
                    columnIndex = 10 - word.length; 
                }
                break;
            }
            default: break;
        }

        newStartIndex = rowIndex * 10  + columnIndex;

        startLetter = newStartIndex;

        let isPlaceEmpty = checkOccupation(word, newStartIndex, orientation);

        let characters = word.toString().split('');

        if(isPlaceEmpty) {
            characters.forEach((char, i) => {

                let temp_rowIndex = rowIndex;
                let temp_columnIndex = columnIndex;
    
                switch(orientation) {
                    case 'row': {
                        temp_columnIndex = columnIndex + i;
                        break;
                    }
                    case 'column': {
                        temp_rowIndex = rowIndex + i;
                        break;
                    }
                    case 'diagonal': {
                        temp_rowIndex = rowIndex + i;
                        temp_columnIndex = columnIndex + i;
                        break;
                    }
                    default: break;
                }
                
                document.querySelector(`[data-row="${temp_rowIndex}"]` + `[data-column="${temp_columnIndex}"]`).innerText = char;
                document.querySelector(`[data-row="${temp_rowIndex}"]` + `[data-column="${temp_columnIndex}"]`).setAttribute('data-word', word);
                
        
                // Show words
                // document.querySelector(`[data-row="${temp_rowIndex}"]` + `[data-column="${temp_columnIndex}"]`).classList.add('selected');
            })
        }
        else {
            // Repeat arrangement of words from an additional array
            tempWords.push(word);
            arrangeFullWords([word])
        }
    })
}

// Fill free spaces with random letters
function addRandomLetters() {
    let letterElements = document.querySelectorAll('.letter');
    var alphabets = "abcdefghijklmnopqrstuvwxyz";
    letterElements.forEach(el => {
        let char = alphabets.charAt(Math.floor(Math.random() * 26));
        if(el.getAttribute("data-word") == undefined ) el.innerText = char;
    })

}

// Check occupancy for letters, to avoid overlapping letters
function checkOccupation(word, startIndex, orientation) {
    let isEmpty = true;

    let rowIndex = Math.floor(startIndex / 10);
    let columnIndex = Math.floor(startIndex % 10);

    for(var i = 0; i < word.length; i++) {
        let element = document.querySelector(`[data-row="${rowIndex}"]` + `[data-column="${columnIndex}"]`);
        switch(orientation) {
            case 'row': {
                columnIndex += 1;
                break;
            }
            case 'column': {
                rowIndex += 1;
                break;
            }
            case 'diagonal': {
                rowIndex += 1;
                columnIndex += 1;
                break;
            }
            default: break;
        }
        
        isEmpty = element != null && element.getAttribute('data-word') == undefined;
        if(isEmpty == false) break;
    }

    return isEmpty;
}


function solve() {
    let grid = prepareGrid();
    let directions = [[0, 1], [1, 0], [1, 1]];

    for(let i = 0; i < 10; i++) {
        for(let j = 0; j < 10; j++) {
            let letter = document.querySelector(`[data-row="${i}"]` + `[data-column="${j}"]`).innerText;
            let start = words.some(word => word.startsWith(letter));

            if(start) {
                for(let dir of directions) {
                    if(start) {
                        let [moves, word] = check(grid, i, j, dir);
                        
                        if(moves.length != 0) {
                            console.log(moves);
                            showSolution(moves, word);
                        };
                    }
                }
            }
        }
    }
}

function check(grid, i, j, directions) {
    let substring = '';
    let moves = [];

    let start_i = i;
    let start_j = j;

    while(i >= 0 && i < 10 && j >= 0 && j < 10) {
        substring += grid[i][j].innerText;

        if(words.some(word => word == substring)) {
            moves.push([start_i, start_j], [i, j]);
            break;
        }
    
        i += directions[0];
        j += directions[1];
    }

    return [moves, substring];
}


function showSolution(moves, word) {
    if(moves[0][0] == moves[1][0]) {
        for(let i = moves[0][1]; i <= moves[1][1]; i++) {
            let letter = document.querySelector(`[data-row="${moves[0][0]}"]` + `[data-column="${i}"]`);
            // Add colors
            let color;
            document.querySelectorAll('.word').forEach(el => {
                if(el.innerText === word) {
                    el.classList.add('done');
                    color = window.getComputedStyle(el).backgroundColor; 
                    setTimeout(() => letter.style.backgroundColor = color, 500);
                }
            })
        }
    }

    if(moves[0][1] == moves[1][1]) {
        for(let i = moves[0][0]; i <= moves[1][0]; i++) {
            let letter = document.querySelector(`[data-row="${i}"]` + `[data-column="${moves[0][1]}"]`);
            // Add colors
            let color;
            document.querySelectorAll('.word').forEach(el => {
                if(el.innerText === word) {
                    el.classList.add('done');
                    color = window.getComputedStyle(el).backgroundColor; 
                    setTimeout(() => letter.style.backgroundColor = color, 500);
                }
            })
        }
    }

    if(moves[0][0] != moves[1][0] && moves[0][1] != moves[1][1]) {
        for(let i = moves[0][0], j = moves[0][1]; (i <= moves[1][0]) && (j <= moves[1][1]); i++, j++) {
            let letter = document.querySelector(`[data-row="${i}"]` + `[data-column="${j}"]`);
            // Add colors
            let color;
            document.querySelectorAll('.word').forEach(el => {
                if(el.innerText === word) {
                    el.classList.add('done');
                    color = window.getComputedStyle(el).backgroundColor; 
                    setTimeout(() => letter.style.backgroundColor = color, 500);
                }
            })
        }
    }
}

function prepareGrid() {
    let arr = [];

    for(let i = 0; i < 10; i++) {
        arr[i] = [];
        for(let j = 0; j < 10; j++) {
            let letter = document.querySelector(`[data-row="${i}"]` + `[data-column="${j}"]`)
            arr[i].push(letter);
        }
    }

    return arr;
}

function clearGame() {
    while(hints.hasChildNodes()) {
        hints.removeChild(hints.firstChild)
    }
    while(letters.hasChildNodes()) {
        letters.removeChild(letters.firstChild)
    }
}

// Add event Listeners
function addEventListeners() {

    solve_btn.addEventListener(('click'), () => {
        solve();
    });

    document.onclick = (event) => {
        if(event.target.tagName.toLowerCase() === 'li') {
            if(event.metaKey) {
                let selectedList = [];

                if(event.target.classList.contains('selected')) {
                    event.target.classList.remove('selected');
                }
                else {
                    event.target.classList.add('selected');
                }

                selectedList.push(event.target);
                selectedWord += event.target.innerText;

                let color;

                // let isWordFound = (words.indexOf(selectedWord) >= 0);

                let isWordFound = false;
                let tempWord = "";

                for(let i = 0; i < words.length; i++) {
                    isWordFound = words[i].toString().split('').every(v => selectedWord.includes(v));

                    if(isWordFound == true) {
                        isWordFound &= selectedList.every(el => el.getAttribute('data-word') == words[i]);
                        isWordFound &= selectedWord.length == words[i].length;
                        tempWord = words[i];
                        selectedWord = '';
                        selectedList = [];
                        break;
                    };
                }

                if(isWordFound) {
                    document.querySelectorAll('.word').forEach(word => {
                        if(word.innerText == tempWord) {
                            word.classList.add('done'); 
                            color = window.getComputedStyle(word).backgroundColor; 
                        }
                    })

                    document.querySelectorAll(`[data-word="${tempWord}"]`).forEach(char => {
                        char.style.backgroundColor = color;
                    })
                }
            }
        }
    }

    document.onkeydown = () => {}

    document.onkeyup = () => {
        if(words.indexOf(selectedWord) == -1) {
            document.querySelectorAll('.letter.selected').forEach(el => {
                el.classList.remove('selected');
            })
            selectedWord = "";
        }
    }
}