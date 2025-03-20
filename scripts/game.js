let images = [];
let favoriteArts = JSON.parse(localStorage.getItem('favoriteArts')) || {};
let arts = Object.values(favoriteArts);
arts.forEach(art => {
    images.push(art.image);
});
let randomImage = (images.length !== 0) ? images[Math.floor(Math.random()*images.length)] : '../image/defalt_img.jpg';
 

class Board {
    constructor(imgNWidth, imgNHeight, rowCols) {
        if (Board._instance) {
            throw new Error('There can be only one board per puzzle');
        }
        Board._instance = this,
        this.rowCols = rowCols,
        //puzzle size
        this.width = 600,
        this.height = 600,
        //siaze of each piece of original image
        this.widthIP = Math.floor(imgNWidth / this.rowCols),
        this.heightIP = Math.floor(imgNHeight / this.rowCols),
        // size of each tile of the puzzle
        this.tileWidth = Math.floor(this.width / this.rowCols),
        this.tileHeight = Math.floor(this.height / this.rowCols)
    }
}

var canvas = document.querySelector('.canvas');
var ctx = canvas.getContext('2d', { willReadFrequently: true });
var board;
var tileImgs = [];
var tileIds = []; // index
var shuffledIds = [];

var img = new Image();
img.crossOrigin = "Anonymous";
img.onload = cutImageIntoPieces;
img.src = `${randomImage}`;

function cutImageIntoPieces() {
    board = new Board(this.naturalWidth, this.naturalHeight, 3);
    canvas.width = board.width;
    canvas.height = board.height;
    canvas.addEventListener('click', move);
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //logic to cut the image into multiple pieces
    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = board.tileWidth;
    tempCanvas.height = board.tileHeight;
    let tempCtx = tempCanvas.getContext('2d');

    for(let row = 0; row < board.rowCols; row++) {
        for(let col = 0; col < board.rowCols; col++) {
            tempCtx.drawImage(this, row*board.widthIP, col*board.heightIP, board.widthIP, board.heightIP, 0, 0, tempCanvas.width, tempCanvas.height );
            tileImgs.push(tempCanvas.toDataURL());
            let id = row + col * board.rowCols;
            tileIds.push(id);
        }
    }
    shuffle();
    drawAllTiles();
}

function shuffle() {
    shuffledIds = [...tileIds];
    shuffledIds.sort(()=> Math.random()-0.5);
    for(let i = 0; i < shuffledIds.length; i++ ) {
        if(shuffledIds[i] != tileIds[i]) {
            let blank = Math.round(Math.random()*(board.rowCols*board.rowCols - 1))
            shuffledIds[blank] = -1;
            return;
        }
    }
    shuffle();
}

function drawAllTiles() {
    for(let index = 0; index < shuffledIds.length; index++) {
        if(shuffledIds[index] == -1) continue;

        let coord = getRowColFromIndex(index) // координаты
        let x = coord.x // row number
        let y = coord.y // column number
        let imgURL = tileImgs[shuffledIds[index]];
        let imgObj = new Image();
        imgObj.onload = function() {
            ctx.drawImage(this, 0, 0, this.width, this.height, x*board.tileWidth, y*board.tileHeight, board.tileWidth, board.tileHeight);
        }
        imgObj.src = imgURL;
    }
}

function getRowColFromIndex(i) {
    let col = Math.floor(i / board.rowCols);
    let row = i % board.rowCols;
    return {x: row, y: col};
}

function move(e){
    e.preventDefault();
    let coords = getMouseCoords(e.clientX, e.clientY);
    let tileX = coords.x;  // row number
    let tileY = coords.y;   // column

    let blankCoords = getRowColFromIndex(findBlankIndex());
    let blankX = blankCoords.x;  // row number of blank tile
    let blankY = blankCoords.y;  // col number of blank tile

    if(!hasBlankNeighbor(tileX, tileY, blankX, blankY)) return;
    // store pixels of the tile with image into temp variable

    let swapDataImage = ctx.getImageData(tileX*board.tileWidth, tileY*board.tileHeight, board.tileWidth, board.tileHeight);
    ctx.fillRect(tileX*board.tileWidth, tileY*board.tileHeight, board.tileWidth, board.tileHeight);
    ctx.putImageData(swapDataImage, blankX * board.tileWidth, blankY * board.tileHeight);

    const imgIdx = getIndexFromCoords(tileX, tileY);
    const blankIdx = getIndexFromCoords(blankX, blankY);

    swapIndex(imgIdx, blankIdx);
    // todo: logic to check if the puzzle is solved or not
}

function getMouseCoords(x, y) {
    let row = Math.floor(x / board.tileWidth);
    let col = Math.floor(y / board.tileHeight);
    return {x: row, y: col};
}

function findBlankIndex() {
    for(let i = 0; i < shuffledIds.length; i++) {
        if(shuffledIds[i] == -1) return i;
    }
}

function hasBlankNeighbor(tileX, tileY, blankX, blankY) {
    if(tileX != blankX && tileY != blankY) return false;
    if(Math.abs(tileX - blankX) == 1 || Math.abs(tileY - blankY) == 1) return true;
    return false;
}

function getIndexFromCoords(x, y) {
    return x + y * board.rowCols;
}

function swapIndex(imgIdx, blankIdx) {
    shuffledIds[blankIdx] = shuffledIds[imgIdx];
    shuffledIds[imgIdx] = - 1;
}