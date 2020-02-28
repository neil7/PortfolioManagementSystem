var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var app = [];
var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + app.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
//recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var sb = document.getElementById('search_bar');
var hints = document.querySelector('.hints');
var find = document.getElementById("search");
document.body.ondblclick = function() {
    recognition.start();
    console.log('Ready to receive a command.');
}

recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The [last] returns the SpeechRecognitionResult at the last position.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object

    var last = event.results.length - 1;
    var command = event.results[last][0].transcript;
    command = command.toLowerCase();
    diagnostic.textContent = 'Result received: ' + command + '.';
    sb.focus();
    sb.value = command;

    if (command.includes("log")) {
        window.location.href = "/login";
    } else if (command.includes("sign")) {
        window.location.href = "/signup";
    } else {
        sb.value = command;
        find.click();
    }
    console.log(command);

    diagnostic.textContent = 'Result received: ' + command + '.';
    //bg.style.backgroundColor = color;
    console.log('Confidence: ' + event.results[0][0].confidence);
}

recognition.onspeechend = function() {
    recognition.stop();
}

recognition.onnomatch = function(event) {
    diagnostic.textContent = "I didn't recognise that color.";
}

recognition.onerror = function(event) {
    diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}