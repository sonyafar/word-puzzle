// global variables
var words = ['milk', 'oats', 'cheese', 'butter', 'sugar', 'bread', 'jam', 'fish', 'sausage', 'ham', 'steak'];
var selectedWord = "";
const letters = document.getElementById('letters');
const colors = [
    "#90D68E", // green
    "#FFDB80", // yellow
    "#E0B9F3", // purple
    "#FF9A9A", // coral
    "#A3E0FB", // blue
    "#B1C5F9" // violet
];


window.onload = () => {
    addEventListeners();
    showLetters();
}






function showLetters() {
    arrangeLetters();
    getHints();
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
    const hints = document.getElementById('hints');
    words.forEach(el => {
        const word = document.createElement('p');
        word.className = 'word';
        word.innerText = el;
        word.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        hints.appendChild(word);
    })
}

function arrangeFullWords(words) {
    let letterPositions = [ 'row', 'column'];
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
                columnIndex = (columnIndex + word.length > 10) ?  10 - word.length : columnIndex; 
                startLetter = document.querySelector(`[data-row="${rowIndex}"]` + `[data-column="${columnIndex}"]`);
                break;
            }
            case 'column': {
                rowIndex = (rowIndex + word.length > 10) ? 10 - word.length : rowIndex; 
                startLetter = document.querySelector(`[data-row="${rowIndex}"]` + `[data-column="${columnIndex}"]`);
                break;
            }
            case 'diagonal': {
                break;
            }
            default: break;
        }

        newStartIndex = rowIndex * 10  + columnIndex;

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
                    default: break;
                }
                
                document.querySelector(`[data-row="${temp_rowIndex}"]` + `[data-column="${temp_columnIndex}"]`).innerText = char;
                document.querySelector(`[data-row="${temp_rowIndex}"]` + `[data-column="${temp_columnIndex}"]`).setAttribute('data-word', word);
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
            case "row": {
                columnIndex += 1;
                break;
            }
            case "column": {
                rowIndex += 1;
                break;
            }
            default: break;
        }
        
        isEmpty = element != null && element.getAttribute('data-word') == undefined;
        if(isEmpty == false) break;
    }

    return isEmpty;
}

// Add event Listeners
function addEventListeners() {

    document.onclick = (event) => {
        if(event.target.tagName.toLowerCase() === 'li') {
            if(event.metaKey) {
                if(event.target.classList.contains('selected')) {
                    event.target.classList.remove('selected');
                }
                else {
                    event.target.classList.add('selected');
                }

                selectedWord += event.target.innerText;



                let color;

                if(words.indexOf(selectedWord) >= 0) {
                    document.querySelectorAll('.word').forEach(word => {
                        if(word.innerText == selectedWord) {
                            word.classList.add('done'); 
                            color = window.getComputedStyle(word).backgroundColor; 
                        }
                    })

                    document.querySelectorAll(`[data-word="${selectedWord}"]`).forEach(char => {
                        char.style.backgroundColor = color;
                    })
                }
            }
        }
    }

    document.onkeydown = () => {}

    document.onkeyup = () => {
        selectedWord = "";
    }
}