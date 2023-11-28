// const stringSimilarity = require('string-similarity');
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const colorTranslations = {
    'negro': 'black',
    'blanco': 'white',
    'rojo': 'red',
    'verde': 'green',
    'azul': 'blue',
    'amarillo': 'yellow',
    'rosa': 'pink',
    'naranja': 'orange',
    'púrpura': 'purple',
    'gris': 'gray',
    'marrón': 'brown',
    'azul marino': 'navy',
    'verde azulado': 'teal',
    'plata': 'silver',
    'lima': 'lime',
    'aguamarina': 'aqua',
    'granate': 'maroon',
    'oliva': 'olive',
    'coral': 'coral',
    'fucsia': 'fuchsia',
    'trigo': 'wheat',
    'lavanda': 'lavender',
    'turquesa': 'turquoise',
    'bronceado': 'tan',
    'azul cielo': 'skyblue',
    'salmón': 'salmon',
    'ciruela': 'plum',
    'orquídea': 'orchid',
    'marfil': 'ivory',
    'oro': 'gold'
};
  
  var spanishColors = Object.keys(colorTranslations);
  var englishColors = Object.values(colorTranslations);
  

var recognition = new SpeechRecognition();
if (SpeechGrammarList) {
  // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
  // This code is provided as a demonstration of possible capability. You may choose not to use it.
  var speechRecognitionList = new SpeechGrammarList();
  var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + spanishColors.join(' | ') + ' ;'
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
}
recognition.continuous = false;
recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');

var colorHTML= '';
Object.entries(colorTranslations).forEach(function(entry, index){
    let [spanishColor, englishColor] = entry;
    // console.log(`Spanish: ${spanishColor}, English: ${englishColor}, Index: ${index}`);
    colorHTML += '<span style="background-color:' + englishColor + ';"> ' + spanishColor + ' </span>';
});
hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try ' + colorHTML + '.';
var isRecognitionRunning = false;
document.body.onclick = function() {
if (isRecognitionRunning == false) {
    recognition.start();
    isRecognitionRunning = true;
    console.log('Ready to receive a color command.');
    }
//   recognition.start();
//   console.log('Ready to receive a color command.');
}

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  var spanishColor = event.results[0][0].transcript.toLowerCase();
  const matches = stringSimilarity.findBestMatch(spanishColor, spanishColors);
  const bestSpanishColor = matches.bestMatch.target;
  console.log('heard spanish word', spanishColor, 'bestSpanishColor: ' + bestSpanishColor);
  var englishColor = colorTranslations[bestSpanishColor];
  diagnostic.textContent = 'I heard ' + spanishColor + '. I guess you mean ' + bestSpanishColor + '.';
  bg.style.backgroundColor = englishColor;
  console.log('heard spanishColor: ' + spanishColor, 'change to englishColor: ' + englishColor);
  console.log('Confidence: ' + event.results[0][0].confidence);
}

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that color.";
}

recognition.onend = function() {
    isRecognitionRunning = false;
    // Uncomment the next line if you want to automatically restart recognition
    // recognition.start();
};

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}