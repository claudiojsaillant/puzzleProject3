let MAIN_ARR;

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
}

const swapNeighbor = (spaceEl, currEl) => {
  let tempRow = currEl.getAttribute("row");
  let tempCol = currEl.getAttribute("col");
  temp = MAIN_ARR[spaceEl.getAttribute("row")][spaceEl.getAttribute("col")];
  MAIN_ARR[spaceEl.getAttribute("row")][spaceEl.getAttribute("col")] = MAIN_ARR[tempRow][tempCol]
  MAIN_ARR[tempRow][tempCol] = temp;
  currEl.setAttribute("col", spaceEl.getAttribute("col"));
  currEl.setAttribute("row", spaceEl.getAttribute("row"));
  spaceEl.setAttribute("col", tempCol);
  spaceEl.setAttribute("row", tempRow);
  elementsSwapper(currEl, spaceEl);
}

const shuffleTable = () => {
  for(let h = 0; h < 1000; h++){
    let spaceEl = document.getElementsByClassName("space")[0];
    let neighbors = spaceNeighbors(spaceEl.getAttribute("row"), spaceEl.getAttribute("col"), MAIN_ARR);
    let randomIndex = Math.floor(Math.random() * neighbors.length);
    let currEl = document.getElementById("cube" + neighbors[randomIndex]);
    swapNeighbor(spaceEl, currEl);
  }
}

const tableCreator = (row, col) => {
    let count = 0;
    let table = document.getElementById("myTable")
    let arr = [];
    for(let i = 0; i < row; i++){
        
        let newRow = document.createElement("tr");
        let arrRow = [];
        newRow.setAttribute("id", "row" + (i+1));
        for(let g = 0; g < col; g++){
            count++;
          
            let newCol = document.createElement("td");
            newCol.innerText = count;
            if(count == row * col){
                newCol.innerText = "";
                newCol.setAttribute("class", "space");
                arrRow.push("space");
            } else {
                arrRow.push(count);
            }
            newCol.setAttribute("value", count);
            newCol.setAttribute("id", "cube" + count);
            newCol.setAttribute("row", i);
            newCol.setAttribute("col", g);
            newRow.appendChild(newCol);
        }
        arr.push(arrRow);
        table.appendChild(newRow);    
    }
    MAIN_ARR = arr;
}


let spaceNeighbors = (i, j, arr) => {
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

tableCreator(4,4);
shuffleTable();

document.addEventListener('click', (event) => {
  const isClickable = event.target.nodeName === "TD";
  if (isClickable) {

      let currEl = event.target;
      let currElValue = parseInt(currEl.getAttribute("value"));
      let spaceEl = document.getElementsByClassName("space")[0];
      let neighbors = spaceNeighbors(spaceEl.getAttribute("row"), spaceEl.getAttribute("col"), MAIN_ARR);

      if(neighbors.includes(currElValue)){

        swapNeighbor(spaceEl, currEl);

      } else {
      
        // alert("Can't swap elements that are not neighbors with the space");

      }
     
      


  }

});



