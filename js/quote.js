// load dom elements
const quoteField = document.getElementById('quote');
const authorField = document.getElementById('author');
const qodContainer = document.getElementById('qod-container');

function loadQuote() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.quotable.io/random', true);

  xhr.onload = function () {
    if (this.status == 200) {
      var quote = JSON.parse(this.responseText);

      // set dom elements
      quoteField.textContent = '"' + quote.content + '"';
      authorField.textContent = quote.author;

    }
  }
  xhr.send();
}

qodContainer.addEventListener("click", loadQuote);

//load initial quote on page load
loadQuote();