let MAIN_ARR;
let winStr = "";

const elementsSwapper = (obj1, obj2) => {
  // create marker element and insert it where obj1 is
  var temp = document.createElement("div");
  obj1.parentNode.insertBefore(temp, obj1);

  // move obj1 to right before obj2
  obj2.parentNode.insertBefore(obj1, obj2);

  // move obj2 to right before where obj1 used to be
  temp.parentNode.insertBefore(obj2, temp);

  // remove temporary marker node
  temp.parentNode.removeChild(temp);
};

const winCheck = () => {
  // Making current string from main ARR
  let myStr = "";
  MAIN_ARR.forEach((el) => {
    myStr += el.join("");
  });
  // Comparing current string vs winString created when the table was also created.
  return myStr === winStr;
};

const swapNeighbor = (spaceEl, currEl) => {
  // Getting the row/col atrribute from the current element
  let tempRow = currEl.getAttribute("row");
  let tempCol = currEl.getAttribute("col");
  // Swapping same elements in MAIN ARR so we can keep track of the squares
  let temp = MAIN_ARR[spaceEl.getAttribute("row")][spaceEl.getAttribute("col")];
  MAIN_ARR[spaceEl.getAttribute("row")][spaceEl.getAttribute("col")] =
    MAIN_ARR[tempRow][tempCol];
  MAIN_ARR[tempRow][tempCol] = temp;
  // Swapping both elements attributes
  currEl.setAttribute("col", spaceEl.getAttribute("col"));
  currEl.setAttribute("row", spaceEl.getAttribute("row"));
  spaceEl.setAttribute("col", tempCol);
  spaceEl.setAttribute("row", tempRow);
  // Finnally swapping the elements
  elementsSwapper(currEl, spaceEl);
  currEl.classList.add("animate__rollIn");
  spaceEl.classList.add("animate__rollOut");
  setTimeout(function () {
    spaceEl.classList.remove("animate__rollOut");
    currEl.classList.remove("animate__rollIn");
  }, 750);
  
};

const shuffleTable = () => {
  for (let h = 0; h < 1000; h++) {
    // Getting space el
    let spaceEl = document.getElementsByClassName("space")[0];
    // Pull space neighbors
    let neighbors = spaceNeighbors(
      spaceEl.getAttribute("row"),
      spaceEl.getAttribute("col"),
      MAIN_ARR
    );
    // Swap space with random neighbor
    let randomIndex = Math.floor(Math.random() * neighbors.length);
    let currEl = document.getElementById("cube" + neighbors[randomIndex]);
    swapNeighbor(spaceEl, currEl);
  }
};

const pictureChanger = (img) => {
  // Setting url pic for each cube
  let imgUrl = "url(" + img + ")";
  // Background position for each cube
  let positions = [
    "0px 0px",
    "-100px 0px",
    "-200px 0px",
    "-300px 0px",
    "0px -100px",
    "-100px -100px",
    "-200px -100px",
    "-300px -100px",
    "0px -200px",
    "-100px -200px",
    "-200px -200px",
    "-300px -200px",
    "0px -300px",
    "-100px -300px",
    "-200px -300px",
  ];
  //Setting background + position for each cube
  for (let i = 1; i < 16; i++) {
    let currentEl = document.getElementById("cube" + i);
    currentEl.style.backgroundImage = imgUrl;
    currentEl.style.backgroundPosition = positions[i - 1];
  }
};

const tableCreator = (row, col) => {
  let count = 0;
  // Getting table element
  let table = document.getElementById("myTable");
  // Making sure its empty before appending childs
  table.innerHTML = "";
  let arr = [];
  for (let i = 0; i < row; i++) {
    // Create new row
    let newRow = document.createElement("tr");
    let arrRow = [];
    newRow.setAttribute("id", "row" + (i + 1));
    for (let g = 0; g < col; g++) {
      // Keeping track of all the squares created
      count++;
      // Creating data for each row
      let newCol = document.createElement("td");
      newCol.innerText = count;
      // Make the last element the space
      if (count == row * col) {
        newCol.innerText = "";
        newCol.setAttribute("class", "space");
        arrRow.push("space");
      } else {
        arrRow.push(count);
      }
      // Atributes used to keep track of the cubes with --> MAIN_ARR indexes
      newCol.setAttribute("value", count);
      newCol.setAttribute("id", "cube" + count);
      newCol.classList.add("animate__animated");
      newCol.setAttribute("row", i);
      newCol.setAttribute("col", g);
      newRow.appendChild(newCol);
    }
    arr.push(arrRow);
    table.appendChild(newRow);
  }
  // Creating win string for later comparisons
  winStr = "";
  MAIN_ARR = arr;
  MAIN_ARR.forEach((el) => {
    winStr += el.join("");
  });
};

let spaceNeighbors = (i, j, arr) => {
  // return all existing neighbors from space if exist
  let myNeigs = [];
  i = parseInt(i);
  j = parseInt(j);

  if (checkIndex(i, j + 1, arr)) {
    // left
    myNeigs.push(arr[i][j + 1]);
  }
  if (checkIndex(i, j - 1, arr)) {
    // right
    myNeigs.push(arr[i][j - 1]);
  }
  if (checkIndex(i + 1, j, arr)) {
    // up
    myNeigs.push(arr[i + 1][j]);
  }
  if (checkIndex(i - 1, j, arr)) {
    // down
    myNeigs.push(arr[i - 1][j]);
  }
  return myNeigs;
};

const checkIndex = (i, j, arr) => {
  // Just an index checker to see if an element exist in arr (spaceNeighbor helper)
  let myI = arr.length;
  if (myI <= i || i < 0) {
    return false;
  }
  let myJ = arr[i].length;
  if (myJ <= j || j < 0) {
    return false;
  }
  return true;
};

document.addEventListener("click", (event) => {
  // Make sure we are clicking a cube
  let table = document.getElementById("myTable");

  const isClickable = event.target.nodeName === "TD";
  if (isClickable) {
    let currEl = event.target;
    let currElValue = parseInt(currEl.getAttribute("value"));
    let spaceEl = document.getElementsByClassName("space")[0];
    // Get current space neighbors
    let neighbors = spaceNeighbors(
      spaceEl.getAttribute("row"),
      spaceEl.getAttribute("col"),
      MAIN_ARR
    );
    // if the cube clicked is a neighbor
      console.log(currElValue);
      console.log(neighbors);
    if (neighbors.includes(currElValue)) {
      // swap space and element
      swapNeighbor(spaceEl, currEl);
      // also check if the use won after the swap
      if (winCheck()) {
        alert("You won");
        stopTimer();
      }
    } else {
      // current square is not a neighbor so it can't be moved.
      table.classList.add("animate__jello");
      setTimeout(function () {
        table.classList.remove("animate__jello");
      }, 700);
    }
  }
});

// Hiding shuffle button until game is created
document.getElementById("shuffle").style.visibility = "hidden";

//Click start button
document.getElementById("startBtn").addEventListener("click", () => {
  console.log("Click the btn!");
  let el = document.getElementById("sizes");
  // Get user's selected dimension from dropdown
  let rows = parseInt(el.options[el.selectedIndex].getAttribute("row"));
  let cols = parseInt(el.options[el.selectedIndex].getAttribute("col"));
  // Validate input
  if (rows === NaN || cols === NaN) {
    alert("Rows and Cols have to be a integer number.");
  } else {
    // All images available
    let imgObj = {
      1: "./assets/img/apple.png",
      2: "./assets/img/elephant.png",
      3: "./assets/img/mario.png",
      4: "./assets/img/react.png",
    };

    if (cols === 4) {
      // Get which image the use wants
      image = prompt(
        "Images available: Insert 1 for apple, 2 for elephant, 3 for mario and 4 for react"
      );
      // Create the table with the dimesions the user gave (4 x 4)
      tableCreator(rows, cols);
      // Change the picture because the dimesion is 4 x 4
      pictureChanger(imgObj[parseInt(image)]);
    } else {
      // Create the table with the dimesions the user gave (8 x 8, 10 x 10, 12 x 12)
      tableCreator(rows, cols);
    }
    // Make shuffle button visible since the table is created
    document.getElementById("shuffle").style.visibility = "visible";
    startTimer();
  }
});

// Call shuffle function everytime shuffle button is clicked
document.getElementById("shuffle").addEventListener("click", () => {
  shuffleTable();
});

// Audio

let audioElement = document.getElementById("audio");
let timerElement = document.getElementById("timer");
let seconds = 0;
let playTime = 5 * 60 * 1000; // Minutes for game length

let timer; // Interval for updating timer
let timeout; // Timeout for game length

timerElement.style.visibility = "hidden"; // Hide the timer on load

function playAudio() {
  audioElement.play();
}

function pauseAudio() {
  audioElement.pause();
}

function showTimer() {
  timerElement.style.visibility = "visible";
}

function hideTimer() {
  timerElement.style.visibility = "hidden";
}

function formatTime() {
  let nMinutes = Math.floor(seconds / 60);
  let nSeconds = seconds - nMinutes * 60;
  
  nMinutes = nMinutes.toString();
  nSeconds = nSeconds.toString();

  nMinutes = nMinutes.length == 1 ? "0" + nMinutes : nMinutes;
  nSeconds = nSeconds.length == 1 ? "0" + nSeconds : nSeconds;
  
  return nMinutes + ":" + nSeconds;
}

function updateTime() {
  seconds++;
  timerElement.innerHTML = formatTime();
}

function startTimer() {
  if (timer || timeout) {
    stopTimer();  // In case the startTimer function is called while running
  }

  showTimer();
  playAudio();

  timer = setInterval(updateTime, 1000);
  timeout = setTimeout(() => { lose(); }, playTime);
}

function lose() {
  stopTimer();
  alert("You ran out of time!");
}

function stopTimer() {
  clearInterval(timer);
  clearTimeout(timeout);
  pauseAudio();
  hideTimer();

  seconds = 0;
  timerElement.innerHTML = "";
}
