

function createCard(data) {
    var html = cardTemplate(data);
    html = html.trim();
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}

const cardTemplate = (data) => `
  <div class="color-search-card">
    <div class="color-search-color-info">
      <div>
        <h3>${data.hex}</h3>
      </div>
      <div>
        <h3>${data.rgb}</h3>
      </div>
      <div>
        <h3>${data.name}</h3>
      </div>
      <div>
      <button class="color-search-button" style="background-color:${data.hex}">
        Copy to Clipboard
      </button>
      </div>
    </div>
    <div id="color-search-color-wheel" class="color-search-color-wheel">.
  </div>
`;
