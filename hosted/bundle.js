'use strict';

var list = ['GOD', 'DOG', 'BOTTLE'];
var letters = 0;
var typed = void 0;
var cashMoneys = void 0;
var spans = void 0;
var words = void 0;
var money = void 0;

var handleDomo = function handleDomo(e) {
	e.preventDefault(0);

	$("#domoMessage").animate({ width: 'hide' }, 350);

	if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
		handleError("RAWR! All fields are required");
		return false;
	}
	sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
		loadDomosFromServer();
	});

	return false;
};

function random() {
	words.innerHTML = "";
	var random = Math.floor(Math.random() * 3);
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
			money.innerHTML = cashMoneys; //add cashMoneys to the cashMoneys div
			document.removeEventListener("keydown", typing, false);
			setTimeout(function () {
				words.className = "words"; // restart the classes
				random(); // give another word
				document.addEventListener("keydown", typing, false);
			}, 400);
		}
	}
}

var DomoForm = function DomoForm(props) {

	return null;
};

var DomoList = function DomoList(props) {
	words = document.querySelector('.words');
	money = document.querySelector('.money');
	cashMoneys = 0;
	return React.createElement(
		'div',
		{ className: 'domoList' },
		React.createElement(
			'div',
			{ className: 'scoreWrap' },
			React.createElement(
				'h2',
				null,
				'Money'
			),
			React.createElement(
				'span',
				{ className: 'money' },
				'0'
			)
		),
		React.createElement(
			'div',
			{ className: 'wordsWrap' },
			React.createElement('h3', { className: 'words' })
		)
	);
	/*
 if(props.domos.length === 0){
 return(
 	<div className="domoList">
 		<h3 className="emptyDomo">No Domos yet</h3>
 	</div>
 );
 }
 
 const domoNodes = props.domos.map(function(domo){
 return(
 	<div key={domo._id} className="domo">
 		<img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
 		<h3 className="domoName"> Name: {domo.name} </h3>
 		<h3 className="domoAge"> Age: {domo.age}</h3>
 	</div>
 );
 });
 return(
 <div className = "domoList">
 	{domoNodes}
 </div>
 );
 */
};

var loadDomosFromServer = function loadDomosFromServer() {
	sendAjax('GET', '/getDomos', null, function (data) {
		ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
	});
};

var setup = function setup(csrf) {
	ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

	ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

	loadDomosFromServer();
};

var getToken = function getToken() {
	sendAjax('GET', '/getToken', null, function (result) {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});

document.addEventListener("keydown", typing, false);
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({ width: 'hide' }, 350);
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
