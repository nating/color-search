/*

main.js by Geoffrey Natin

*/

//------------------- CONSTANTS -------------------

const RGB_COLOR_REGEX = new RegExp('rgba?\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*\\)');
const HEX_COLOR_REGEX = new RegExp('#(?:[0-9a-fA-F]{3}){1,2}$');
const COLOR_NAMES_URL = chrome.runtime.getURL('colornames.json');

//--------------------- MAIN ----------------------

var query = document.getElementsByName("q")[0].value;
var queryHasRGBColor = RGB_COLOR_REGEX.test(query);
var queryHasHexColor = HEX_COLOR_REGEX.test(query);

if(queryHasRGBColor || queryHasHexColor){

  var hexColor = queryHasHexColor ? HEX_COLOR_REGEX.exec(query)[0].toUpperCase() : rgbToHex(RGB_COLOR_REGEX.exec(query)[0]);
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

function injectColorCard(hexColor, rgbColor, size = 200){

  // Text color needs to contrast background-color
  var rgb = rgbColor.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
  var o = Math.round(((parseInt(rgb[1]) * 299) +
                    (parseInt(rgb[2]) * 587) +
                    (parseInt(rgb[3]) * 114)) / 1000);
  var btnTextColor = (o > 125) ? 'black' : 'white';

  var colorName = '';
  fetch(COLOR_NAMES_URL)
      .then((response) => {return response.json()})
      .then((colors) => {
        for(i in colors){
          var color = colors[i];
          if(color.hex==hexColor.toLowerCase()){

            // Create card
            var templateData = {
              hex: hexColor,
              rgb: rgbColor,
              textColor: btnTextColor,
              name: color.name
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

            break;
          }
        }
      });

  if(colorName==''){

      // Create card
      var templateData = {
        hex: hexColor,
        rgb: rgbColor,
        textColor: btnTextColor,
        name: ' '
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
  }

}
