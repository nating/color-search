
function createCard(data) {
    var html = cardTemplate(data);
    html = html.trim();
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}

function copy(text) {
    var input = document.createElement('input');
    input.setAttribute('value', text);
    input.setAttribute('display', 'none');
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input)
    return result;
 }

const cardTemplate = (data) => `
  <div class="color-search-card" style="color:${data.textColor};">
    <div class="color-search-color-info" style="background-color:${data.hex};">
      <div>
        <h3><span id="color-search-hex">${data.hex}</span><span onclick="copy('${data.hex}');" class="paperclip icon"></span></h3>
      </div>
      <div>
        <h3><span id="color-search-rgb">${data.rgb}</span><span onclick="copy('${data.rgb}');" class="paperclip icon"></span></h3>
      </div>
      <div>
        <h3><span id="color-search-name">${data.name}</span><span onclick="copy('${data.name}');" class="paperclip icon"></span></h3>
      </div>
    </div>
    <div id="color-search-color-wheel" onclick="console.log('wheel clicked')" class="color-search-color-wheel">.
  </div>
`;
