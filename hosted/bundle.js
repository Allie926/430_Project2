'use strict';

var list = ['CONJUGATIONS', 'EXTRAVAGANZA', 'ENTANGLEMENT', 'JOURNALIZING', 'CIRCUMJACENT', 'EXTRAPOLATE', 'OUTSTANDING', 'DESTRUCTION', 'ACCOMMODATE', 'RAZZAMATAZZ', 'JABBERWOCKY', 'DRIZZLINGLY', 'COMMUNIZING', 'ZYGOMORPHIC', 'CHOCKABLOCK', 'EPOXIDIZING', 'FUTURISTIC', 'ARITHMETIC', 'PUNISHMENT', 'CONSCIENCE', 'BEMUZZLING', 'ZIGZAGGING', 'DAZZLINGLY', 'PSYCHOTIC', 'BUZZWORDS', 'SUBSCRIBE', 'BEAUTIFUL', 'TREATMENT', 'QUIZZICAL', 'PLAYWRIGHT', 'HUZZAHING', 'SCHNOZZLE', 'CAUTIOUS', 'MANIACAL', 'CONTINUE', 'EMBEZZLE', 'ZYZZYVAS', 'FLAPJACK', 'CONSULT', 'IDIOTIC', 'TREMBLE', 'JOURNEY', 'APPLAUD', 'PUNGENT', 'BOTTLE', 'COPPER', 'CREDIT', 'DEGREE', 'SUPPLY', 'REPAIR', 'GOVERN', 'RHYTHM', 'SYZYGY', 'MONEY', 'GUSTY', 'SHAPE', 'MURKY', 'LUCKY', 'SALTY', 'WEAVE', 'CHIN', 'CHAT', 'GOOD', 'YOKE', 'YOLK', 'JINX', 'JAVA', 'GOD', 'DOG', 'LEG', 'BOY', 'BAD', 'SPY', 'EGG', 'GYM'];
var letters = 0;
var typed = void 0;
var cashMoneys = 0; //money variable
var multiplier = 1;
var multCost = 10 + multiplier * multiplier;
var moneyTime = 0;
var timeCost = 10 + moneyTime * moneyTime;
var spans = void 0;
var words = void 0;
var money = void 0;
var nowTime = void 0;
var checkTime = void 0;
var wordCount = 20;
var wordCost = wordCount * wordCount - 350;

//handles money, name needs to be changed
var handleMoney = function handleMoney(e) {
	e.preventDefault(0);

	sendAjax('POST', $("#moneyForm").attr("action"), $("#moneyForm").serialize(), function () {
		loadMoneysFromServer();
	});

	return false;
};
//the form for submission/saving at the top
var MoneyForm = function MoneyForm(props) {
	return React.createElement(
		'form',
		{ id: 'moneyForm',
			onSubmit: handleMoney,
			name: 'moneyForm',
			action: '/maker',
			method: 'POST',
			className: 'money'
		},
		React.createElement(
			'label',
			{ id: 'moneyLabel', htmlFor: 'money' },
			'Money: $'
		),
		React.createElement('input', { id: 'inputMoney', type: 'text', name: 'money' }),
		React.createElement('input', { id: 'multiplier', type: 'hidden', name: 'multiplier' }),
		React.createElement('input', { id: 'multCost', type: 'hidden', name: 'multCost' }),
		React.createElement('input', { id: 'moneyTime', type: 'hidden', name: 'moneyTime' }),
		React.createElement('input', { id: 'timeCost', type: 'hidden', name: 'timeCost' }),
		React.createElement('input', { id: 'wordCount', type: 'hidden', name: 'wordCount' }),
		React.createElement('input', { id: 'wordCost', type: 'hidden', name: 'wordCost' }),
		React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
		React.createElement('input', { className: 'makeMoneySubmit', type: 'submit', value: 'Save' })
	);
};
//random word choice function
function random() {
	words.innerHTML = "";
	var random = Math.floor(Math.random() * wordCount);
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
	if (String.fromCharCode(e.which) === "1") {
		if (cashMoneys >= multCost) {
			multiplier += 1;
			cashMoneys -= multCost;
			multCost = 10 + multiplier * multiplier * multiplier;
			document.querySelector("#multiplier").value = multiplier;
			document.querySelector("#multCost").value = multCost;
			document.querySelector("#inputMoney").value = cashMoneys;
			ReactDOM.render(React.createElement(TypeList, { moneys: cashMoneys, multiplier: multiplier, multCost: multCost, moneyTime: moneyTime, timeCost: timeCost, wordCount: wordCount, wordCost: wordCost }), document.querySelector("#moneys"));
		}
	} else if (String.fromCharCode(e.which) === "2") {
		if (cashMoneys >= timeCost) {
			moneyTime += 1;
			cashMoneys -= timeCost;
			timeCost = 10 + moneyTime * moneyTime * moneyTime;
			document.querySelector("#moneyTime").value = moneyTime;
			document.querySelector("#timeCost").value = timeCost;
			document.querySelector("#inputMoney").value = cashMoneys;
			ReactDOM.render(React.createElement(TypeList, { moneys: cashMoneys, multiplier: multiplier, multCost: multCost, moneyTime: moneyTime, timeCost: timeCost, wordCount: wordCount, wordCost: wordCost }), document.querySelector("#moneys"));
		}
	} else if (String.fromCharCode(e.which) === "3") {
		if (cashMoneys >= wordCost && wordCount < 75) {
			wordCount += 5;
			cashMoneys -= wordCost;
			wordCost = wordCount * wordCount - 350;
			document.querySelector("#wordCount").value = wordCount;
			document.querySelector("#wordCost").value = wordCost;
			document.querySelector("#inputMoney").value = cashMoneys;
			ReactDOM.render(React.createElement(TypeList, { moneys: cashMoneys, multiplier: multiplier, multCost: multCost, moneyTime: moneyTime, timeCost: timeCost, wordCount: wordCount, wordCost: wordCost }), document.querySelector("#moneys"));
		}
	} else {
		if (!spans) {
			random();
			return;
		}
		typed = String.fromCharCode(e.which);
		for (var i = 0; i < spans.length; i++) {
			if (spans[i].innerHTML === typed) {
				// if typed letter is the one from the word
				if (spans[i].classList.contains("bg")) {
					// if it already has class with the background color then check the next one
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
				cashMoneys += 1 * multiplier; // increment the cashMoneys
				document.querySelector("#inputMoney").value = cashMoneys;
				document.removeEventListener("keydown", typing, false);
				setTimeout(function () {
					words.className = "words"; // restart the classes
					random(); // give another word
					document.addEventListener("keydown", typing, false);
				}, 400);
			}
		}
	}
}
//the html elements to fill in the middle of the screen
var TypeList = function TypeList(props) {
	//if brand new
	if (!props.moneys && wordCount < 75) {
		return React.createElement(
			'div',
			{ className: 'moneyList' },
			React.createElement('div', { className: 'moneyWrap' }),
			React.createElement(
				'div',
				{ className: 'wordsWrap' },
				React.createElement(
					'h2',
					{ className: 'words' },
					'Press any button to start'
				)
			),
			React.createElement(
				'div',
				{ className: 'upgradeWrap' },
				React.createElement(
					'h3',
					null,
					'Upgrades'
				),
				React.createElement(
					'h4',
					null,
					'Press the corresponding number to upgrade the ability'
				),
				React.createElement(
					'h5',
					{ id: 'upgrade1' },
					'($',
					multCost,
					') 1. Multiplier: ',
					multiplier,
					'x -> ',
					multiplier + 1,
					'x'
				),
				React.createElement(
					'h5',
					{ id: 'upgrade2' },
					'($',
					timeCost,
					') 2. Money over time: $',
					moneyTime,
					' / 5 seconds -> $',
					moneyTime + 1,
					' / 5 seconds'
				),
				React.createElement(
					'h5',
					{ id: 'upgrade3' },
					'($',
					wordCost,
					') 3. More words: ',
					wordCount,
					' -> ',
					wordCount + 5
				)
			)
		);
	} else if (!props.moneys && wordCount >= 75) {
		return React.createElement(
			'div',
			{ className: 'moneyList' },
			React.createElement('div', { className: 'moneyWrap' }),
			React.createElement(
				'div',
				{ className: 'wordsWrap' },
				React.createElement(
					'h2',
					{ className: 'words' },
					'Press any button to start'
				)
			),
			React.createElement(
				'div',
				{ className: 'upgradeWrap' },
				React.createElement(
					'h3',
					null,
					'Upgrades'
				),
				React.createElement(
					'h4',
					null,
					'Press the corresponding number to upgrade the ability'
				),
				React.createElement(
					'h5',
					{ id: 'upgrade1' },
					'($',
					multCost,
					') 1. Multiplier: ',
					multiplier,
					'x -> ',
					multiplier + 1,
					'x'
				),
				React.createElement(
					'h5',
					{ id: 'upgrade2' },
					'($',
					timeCost,
					') 2. Money over time: $',
					moneyTime,
					' / 5 seconds -> $',
					moneyTime + 1,
					' / 5 seconds'
				),
				React.createElement(
					'h5',
					{ id: 'upgrade3' },
					'(MAX) 3. More words: ',
					wordCount
				)
			)
		);
	} else if (wordCount >= 75) {
		return React.createElement(
			'div',
			{ className: 'moneyList' },
			React.createElement('div', { className: 'moneyWrap' }),
			React.createElement(
				'div',
				{ className: 'wordsWrap' },
				React.createElement(
					'h2',
					{ className: 'words' },
					'Press any button to start'
				)
			),
			React.createElement(
				'div',
				{ className: 'upgradeWrap' },
				React.createElement(
					'h3',
					null,
					'Upgrades'
				),
				React.createElement(
					'h4',
					null,
					'Press the corresponding number to upgrade the ability'
				),
				React.createElement(
					'h5',
					{ id: 'upgrade1' },
					'($',
					multCost,
					') 1. Multiplier: ',
					multiplier,
					'x -> ',
					multiplier + 1,
					'x'
				),
				React.createElement(
					'h5',
					{ id: 'upgrade2' },
					'($',
					timeCost,
					') 2. Money over time: $',
					moneyTime,
					' / 5 seconds -> $',
					moneyTime + 1,
					' / 5 seconds'
				),
				React.createElement(
					'h5',
					{ id: 'upgrade3' },
					'(MAX) 3. More words: ',
					wordCount
				)
			)
		);
	} else {
		return React.createElement(
			'div',
			{ className: 'moneyList' },
			React.createElement('div', { className: 'moneyWrap' }),
			React.createElement(
				'div',
				{ className: 'wordsWrap' },
				React.createElement(
					'h2',
					{ className: 'words' },
					'Press any button to start'
				)
			),
			React.createElement(
				'div',
				{ className: 'upgradeWrap' },
				React.createElement(
					'h3',
					null,
					'Upgrades'
				),
				React.createElement(
					'h4',
					null,
					'Press the corresponding number to upgrade the ability'
				),
				React.createElement(
					'h5',
					{ id: 'upgrade1' },
					'($',
					props.multCost,
					') 1. Multiplier: ',
					props.multiplier,
					'x -> ',
					props.multiplier + 1,
					'x'
				),
				React.createElement(
					'h5',
					{ id: 'upgrade2' },
					'($',
					props.timeCost,
					') 2. Money over time: $',
					props.moneyTime,
					' / 5 seconds -> $',
					props.moneyTime + 1,
					' / 5 seconds'
				),
				React.createElement(
					'h5',
					{ id: 'upgrade3' },
					'($',
					props.wordCost,
					') 3. More words: ',
					props.wordCount,
					' -> ',
					props.wordCount + 5
				)
			)
		);
	}
};

//loads the server variables
var loadMoneysFromServer = function loadMoneysFromServer() {
	sendAjax('GET', '/getMoneys', null, function (data) {
		words = document.querySelector('.words');
		money = document.querySelector('.money');
		if (data.moneys.length > 0) {
			cashMoneys = data.moneys[data.moneys.length - 1].money;
			multiplier = data.moneys[data.moneys.length - 1].multiplier;
			multCost = data.moneys[data.moneys.length - 1].multCost;
			moneyTime = data.moneys[data.moneys.length - 1].moneyTime;
			timeCost = data.moneys[data.moneys.length - 1].timeCost;
			wordCount = data.moneys[data.moneys.length - 1].wordCount;
			wordCost = data.moneys[data.moneys.length - 1].wordCost;
			ReactDOM.render(React.createElement(TypeList, { moneys: cashMoneys, multiplier: multiplier, multCost: multCost, moneyTime: moneyTime, timeCost: timeCost, wordCount: wordCount, wordCost: wordCost }), document.querySelector("#moneys"));
		}
		document.querySelector("#multiplier").value = multiplier;
		document.querySelector("#multCost").value = multCost;
		document.querySelector("#moneyTime").value = moneyTime;
		document.querySelector("#timeCost").value = timeCost;
		document.querySelector("#inputMoney").value = cashMoneys;
		document.querySelector("#wordCount").value = wordCount;
		document.querySelector("#wordCost").value = wordCost;
	});
};
//setups the page, calls React
var setup = function setup(csrf) {
	setInterval(function () {
		cashMoneys += moneyTime;
		document.querySelector("#inputMoney").value = cashMoneys;
	}, 5000);
	ReactDOM.render(React.createElement(MoneyForm, { csrf: csrf }), document.querySelector("#makeMoney"));
	ReactDOM.render(React.createElement(TypeList, { moneys: 0 }), document.querySelector("#moneys"));

	loadMoneysFromServer();
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
  $("#moneyMessage").animate({ width: 'toggle' }, 1000);
};

var redirect = function redirect(response) {
  $("#moneyMessage").animate({ width: 'hide' }, 1000);
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
