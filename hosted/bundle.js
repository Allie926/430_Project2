'use strict';

var list = ['GOD', 'DOG', 'BOTTLE', 'PSYCHOTIC', 'COPPER', 'MONEY', 'CONSULT', 'GUSTY', 'IDIOTIC', 'TREMBLE', 'MURKY', 'CREDIT', 'OUTSTANDING', 'CAUTIOUS', 'SHAPE', 'DEGREE', 'SUBSCRIBE', 'MANIACAL', 'CONTINUE', 'SUPPLY'];
var letters = 0;
var typed = void 0;
var cashMoneys = 0; //money variable
var spans = void 0;
var words = void 0;
var money = void 0;

//handles money, name needs to be changed
var handleDomo = function handleDomo(e) {
	e.preventDefault(0);

	sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
		loadDomosFromServer();
	});

	return false;
};
//the form for submission/saving at the top
var DomoForm = function DomoForm(props) {
	return React.createElement(
		'form',
		{ id: 'domoForm',
			onSubmit: handleDomo,
			name: 'domoForm',
			action: '/maker',
			method: 'POST',
			className: 'domoForm'
		},
		React.createElement(
			'label',
			{ htmlFor: 'money' },
			'Money: '
		),
		React.createElement('input', { id: 'domoMoney', type: 'text', name: 'money' }),
		React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
		React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Save' })
	);
};
//random word choice function
function random() {
	words.innerHTML = "";
	var random = Math.floor(Math.random() * 20);
	var wordArray = list[random].split("");
	for (var i = 0; i < wordArray.length; i++) {
		//building the words with spans around the letters
		var span = document.createElement("span");
		span.classList.add("span");
		span.innerHTML = wordArray[i];
		words.appendChild(span);
	}
	spans = document.querySelectorAll(".span");
}
//typing function
function typing(e) {
	if (!spans) {
		random();
		return;
	}
	typed = String.fromCharCode(e.which);
	for (var i = 0; i < spans.length; i++) {
		if (spans[i].innerHTML === typed) {
			// if typed letter is the one from the word
			if (spans[i].classList.contains("bg")) {
				// if it already has class with the bacground color then check the next one
				continue;
			} else if (spans[i].classList.contains("bg") === false && spans[i - 1] === undefined || spans[i - 1].classList.contains("bg") !== false) {
				spans[i].classList.add("bg");
				break;
			}
		}
	}
	var checker = 0;
	for (var j = 0; j < spans.length; j++) {
		//checking if all the letters are typed
		if (spans[j].className === "span bg") {
			checker++;
		}
		if (checker === spans.length) {
			// if so, animate the words with animate.css class
			words.classList.add("animated");
			words.classList.add("fadeOut");
			cashMoneys++; // increment the cashMoneys
			document.querySelector("#domoMoney").value = cashMoneys;
			document.removeEventListener("keydown", typing, false);
			setTimeout(function () {
				words.className = "words"; // restart the classes
				random(); // give another word
				document.addEventListener("keydown", typing, false);
			}, 400);
		}
	}
}
//the html elements to fill in the middle of the screen
var TypeList = function TypeList(props) {
	words = document.querySelector('.words');
	money = document.querySelector('.money');
	//if brand new
	if (props.domos.length === 0) {
		return React.createElement(
			'div',
			{ className: 'domoList' },
			React.createElement('div', { className: 'moneyWrap' }),
			React.createElement(
				'div',
				{ className: 'wordsWrap' },
				React.createElement(
					'h3',
					{ className: 'words' },
					'Press any button to start'
				)
			)
		);
	}
	//else
	var domoNodes = props.domos.map(function (domo) {
		//cashMoneys=props.domos[props.domos.length-1].money;
		//console.log(props.domos[props.domos.length-1]);
		return React.createElement(
			'div',
			{ key: domo._id, className: 'domo' },
			React.createElement(
				'h3',
				{ className: 'domoMoney' },
				' Money: ',
				domo.money
			)
		);
	});
	return React.createElement(
		'div',
		{ className: 'domoList' },
		React.createElement('div', { className: 'moneyWrap' }),
		React.createElement(
			'div',
			{ className: 'wordsWrap' },
			React.createElement(
				'h3',
				{ className: 'words' },
				'Press any button to start'
			)
		)
	);
};
//loads the server variables
var loadDomosFromServer = function loadDomosFromServer() {
	sendAjax('GET', '/getDomos', null, function (data) {
		ReactDOM.render(React.createElement(TypeList, { domos: data.domos }), document.querySelector("#domos"));
	});
};
//setups the page, calls React
var setup = function setup(csrf) {
	ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));
	ReactDOM.render(React.createElement(TypeList, { domos: [] }), document.querySelector("#domos"));

	loadDomosFromServer();
};

var getToken = function getToken() {
	sendAjax('GET', '/getToken', null, function (result) {
		setup(result.csrfToken);
	});
};
//After page loaded, calls getToken
$(document).ready(function () {
	getToken();
});
//used for starting our typing adventure
document.addEventListener("keydown", typing, false);
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: 'toggle' }, 1000);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({ width: 'hide' }, 1000);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
