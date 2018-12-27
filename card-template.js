
function createCard(data) {
    var html = cardTemplate(data);
    html = html.trim();
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}

function copyColor() {
    var input = document.createElement('input');
    input.setAttribute('value', document.getElementById('color-search-hex').innerHTML);
    input.setAttribute('display', 'none');
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input)
    return result;
 }

const cardTemplate = (data) => `
  <div class="color-search-card">
    <div class="color-search-color-info">
      <div>
        <h3 id="color-search-hex">${data.hex}</h3>
      </div>
      <div>
        <h3 id="color-search-rgb">${data.rgb}</h3>
      </div>
      <div>
        <h3 id="color-search-name">${data.name}</h3>
      </div>
      <div>
      <button class="color-search-button" onclick="copyColor();" style="color:${data.btnTextColor};background-color:${data.hex}">
        Copy to Clipboard
      </button>
      </div>
    </div>
    <div id="color-search-color-wheel" onclick="copyColor();" class="color-search-color-wheel">.
  </div>
`;
