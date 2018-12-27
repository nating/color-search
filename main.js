/*

main.js by Geoffrey Natin


*/

//------------------- CONSTANTS -------------------

const RGB_COLOR_REGEX = new RegExp('rgba?\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*\\)');
const HEX_COLOR_REGEX = new RegExp('#(?:[0-9a-fA-F]{3}){1,2}$');

//--------------------- MAIN ----------------------

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

var query = document.getElementsByName("q")[0].value;
var queryHasRGBColor = RGB_COLOR_REGEX.test(query);
var queryHasHexColor = HEX_COLOR_REGEX.test(query);

if(queryHasRGBColor || queryHasHexColor){

  var hexColor = queryHasHexColor ? HEX_COLOR_REGEX.exec(query)[0] : rgbToHex(RGB_COLOR_REGEX.exec(query)[0]);
  var rgbColor = queryHasRGBColor ? RGB_COLOR_REGEX.exec(query)[0] : hexToRgb(HEX_COLOR_REGEX.exec(query)[0]);

  injectColorCard(hexColor,rgbColor);

}

//------------------- COLOR CONVERSION -------------------

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(str) {
    var rgb = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
    var hex = "#" + componentToHex(parseInt(rgb[1])) + componentToHex(parseInt(rgb[2])) + componentToHex(parseInt(rgb[3]));
    return hex.toUpperCase();
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 'rgb(' + parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) + ')' : null;
}

//------------------- CARD INJECTION -------------------

// TODO: get color name from https://github.com/meodai/color-names using https://stackoverflow.com/questions/25107774/how-do-i-send-an-http-get-request-in-chrome-extension

function injectColorCard(hexColor, rgbColor, size = 200){

  var colorWheel = generateColorWheel(200);

  function colorWheelMouse(evt) {
      var ctx = colorWheel.getContext("2d");
      var data = ctx.getImageData(evt.offsetX, evt.offsetY, 1, 1);
      console.log("RGB: " + data.data.slice(0, 3).join(','));
      var rgb = 'rgb(' + data.data.slice(0, 3).join(',') + ')';
      injectColorCard(rgbToHex(rgb),rgb);
  }

  colorWheel.onclick = colorWheelMouse;

  // Text on button to contrast background-color
  var rgb = rgbColor.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
  var o = Math.round(((parseInt(rgb[1]) * 299) +
                    (parseInt(rgb[2]) * 587) +
                    (parseInt(rgb[3]) * 114)) / 1000);
  var btnTextColor = (o > 125) ? 'black' : 'white';

  // Create card
  var templateData = {
    hex: hexColor,
    rgb: rgbColor,
    btnTextColor: btnTextColor,
    name: 'White Fuschia'
  };
  var card = createCard(templateData);

  // Add card to the DOM
  var parent = document.getElementsByClassName('bkWMgd')[0].parentElement;
  if(document.getElementsByClassName('color-search-card')[0]){
    document.getElementsByClassName('color-search-card')[0].replaceWith(card);
  }
  else{
    parent.insertBefore(card, parent.firstChild);
  }
  document.getElementById('color-search-color-wheel').replaceWith(colorWheel);

}


//--------------------- COLOR WHEEL --------------------

// https://stackoverflow.com/a/46217884/7852784

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function generateColorWheel(size, centerColor) {
    if (size === void 0) { size = 400; }
    if (centerColor === void 0) { centerColor = "white"; }
    //Generate main canvas to return
    var canvas = document.createElement("canvas");
    canvas.classList.add('color-search-color-wheel')
    var ctx = canvas.getContext("2d");
    canvas.width = canvas.height = size;
    //Generate canvas clone to draw increments on
    var canvasClone = document.createElement("canvas");
    canvasClone.width = canvasClone.height = size;
    var canvasCloneCtx = canvasClone.getContext("2d");
    //Initiate variables
    var angle = 0;
    var hexCode = [255, 0, 0];
    var pivotPointer = 0;
    var colorOffsetByDegree = 4.322;
    //For each degree in circle, perform operation
    while (angle++ < 360) {
        //find index immediately before and after our pivot
        var pivotPointerbefore = (pivotPointer + 3 - 1) % 3;
        var pivotPointerAfter = (pivotPointer + 3 + 1) % 3;
        //Modify colors
        if (hexCode[pivotPointer] < 255) {
            //If main points isn't full, add to main pointer
            hexCode[pivotPointer] = (hexCode[pivotPointer] + colorOffsetByDegree > 255 ? 255 : hexCode[pivotPointer] + colorOffsetByDegree);
        }
        else if (hexCode[pivotPointerbefore] > 0) {
            //If color before main isn't zero, subtract
            hexCode[pivotPointerbefore] = (hexCode[pivotPointerbefore] > colorOffsetByDegree ? hexCode[pivotPointerbefore] - colorOffsetByDegree : 0);
        }
        else if (hexCode[pivotPointer] >= 255) {
            //If main color is full, move pivot
            hexCode[pivotPointer] = 255;
            pivotPointer = (pivotPointer + 1) % 3;
        }
        //clear clone
        canvasCloneCtx.clearRect(0, 0, size, size);
        //Generate gradient and set as fillstyle
        var grad = canvasCloneCtx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, centerColor);
        grad.addColorStop(1, "rgb(" + hexCode.map(function (h) { return Math.floor(h); }).join(",") + ")");
        canvasCloneCtx.fillStyle = grad;
        //draw full circle with new gradient
        canvasCloneCtx.globalCompositeOperation = "source-over";
        canvasCloneCtx.beginPath();
        canvasCloneCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        canvasCloneCtx.closePath();
        canvasCloneCtx.fill();
        //Switch to "Erase mode"
        canvasCloneCtx.globalCompositeOperation = "destination-out";
        //Carve out the piece of the circle we need for this angle
        canvasCloneCtx.beginPath();
        canvasCloneCtx.arc(size / 2, size / 2, 0, degreesToRadians(angle + 1), degreesToRadians(angle + 1));
        canvasCloneCtx.arc(size / 2, size / 2, size / 2 + 1, degreesToRadians(angle + 1), degreesToRadians(angle + 1));
        canvasCloneCtx.arc(size / 2, size / 2, size / 2 + 1, degreesToRadians(angle + 1), degreesToRadians(angle - 1));
        canvasCloneCtx.arc(size / 2, size / 2, 0, degreesToRadians(angle + 1), degreesToRadians(angle - 1));
        canvasCloneCtx.closePath();
        canvasCloneCtx.fill();
        //Draw carved-put piece on main canvas
        ctx.drawImage(canvasClone, 0, 0);
    }
    //return main canvas
    return canvas;
}
