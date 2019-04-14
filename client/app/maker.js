const list = ['GOD', 'DOG', 'BOTTLE','PSYCHOTIC','COPPER','MONEY','CONSULT','GUSTY','IDIOTIC','TREMBLE',
			  'MURKY', 'CREDIT', 'OUTSTANDING', 'CAUTIOUS', 'SHAPE', 'DEGREE', 'SUBSCRIBE', 'MANIACAL', 'CONTINUE', 'SUPPLY'];
let letters = 0;
let typed;
let cashMoneys;
let spans;
let words;
let money;


const handleDomo = (e) => {
	e.preventDefault(0);
	
	$("#domoMessage").animate({width:'hide'},350);
	
	if($("#domoName").val() == '' || $("#domoAge").val() ==''){
		handleError("RAWR! All fields are required");
		return false;
	}
	sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(),function(){
		loadDomosFromServer();
	});
	
	return false;
};

function random() {
    words.innerHTML = "";
    let random = Math.floor(Math.random() * (20));
    let wordArray = list[random].split("");
    for (let i = 0; i < wordArray.length; i++) { //building the words with spans around the letters
        let span = document.createElement("span");
        span.classList.add("span");
        span.innerHTML = wordArray[i];
        words.appendChild(span);
    }
    spans = document.querySelectorAll(".span");
}

function typing(e) {
	if(!spans){
		random();
		return;
	}
  	typed = String.fromCharCode(e.which);
  	for (let i = 0; i < spans.length; i++) {
		if (spans[i].innerHTML === typed) { // if typed letter is the one from the word
			if (spans[i].classList.contains("bg")) { // if it already has class with the bacground color then check the next one
				continue;
  			}
			else if (spans[i].classList.contains("bg") === false && spans[i-1] === undefined || spans[i-1].classList.contains("bg") !== false ) { 
  				spans[i].classList.add("bg");
  				break;
  			}
  		}
  	}
  	let checker = 0;
  	for (let j = 0; j < spans.length; j++) { //checking if all the letters are typed
  		if (spans[j].className === "span bg") {
  			checker++;
  		}
  		if (checker === spans.length) { // if so, animate the words with animate.css class
  			words.classList.add("animated");
  			words.classList.add("fadeOut");
  			cashMoneys++; // increment the cashMoneys
  			money.innerHTML = cashMoneys; //add cashMoneys to the cashMoneys div
  			document.removeEventListener("keydown", typing, false);
  			setTimeout(function(){
  				words.className = "words"; // restart the classes
  				random(); // give another word
  				document.addEventListener("keydown", typing, false);
  			}, 400);
  		}

  	}
}

const DomoForm = (props) => {
	
	return(
		null
	);
};

const DomoList = function(props) {
  words = document.querySelector('.words');
  money = document.querySelector('.money');
  cashMoneys = 0;
  return (
	<div className = "domoList">
	  <div className="scoreWrap">
	    <h2>Money</h2>
	    <span className="money">0</span>
	  </div>
	  <div className="wordsWrap">
	    <h3 className="words"></h3>
	  </div>
	</div>
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

const loadDomosFromServer = () =>{
	sendAjax('GET', '/getDomos',null,(data)=>{
		ReactDOM.render(
			<DomoList domos={data.domos}/>,document.querySelector("#domos")
		);
	});
};

const setup = function(csrf) {
	ReactDOM.render(
		<DomoForm csrf ={csrf}/>,document.querySelector("#makeDomo")
	);
	
	ReactDOM.render(
		<DomoList domos={[]}/>, document.querySelector("#domos")
	);
	
	loadDomosFromServer();
};

const getToken = () => {
	sendAjax('GET','/getToken',null,(result)=>{
		setup(result.csrfToken);
	});
};

$(document).ready(function(){
	getToken();
});

document.addEventListener("keydown", typing, false);