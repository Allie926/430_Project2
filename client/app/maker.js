const list = ['GOD', 'DOG', 'BOTTLE','PSYCHOTIC','COPPER','MONEY','CONSULT','GUSTY','IDIOTIC','TREMBLE',
			  'MURKY', 'CREDIT', 'OUTSTANDING', 'CAUTIOUS', 'SHAPE', 'DEGREE', 'SUBSCRIBE', 'MANIACAL', 'CONTINUE', 'SUPPLY'];
let letters = 0;
let typed;
let cashMoneys = 0;
let spans;
let words;
let money;

//handles money, name needs to be changed
const handleDomo = (e) => {
	e.preventDefault(0);
	
	sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(),function(){
		loadDomosFromServer();
	});
	
	return false;
};

const DomoForm = (props) => {
	return(
	  <form id="domoForm"
		onSubmit={handleDomo}
		name="domoForm"
		action="/maker"
		method="POST"
		className="domoForm"
	  >
	  <label htmlFor="money">Money: </label>
	  <input id="domoMoney" type="text" name="money"/>
	  <input type="hidden" name="_csrf" value={props.csrf}/>
	  <input className="makeDomoSubmit" type="submit" value="Save"/>
	  </form>
	);
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
			document.querySelector("#domoMoney").value = cashMoneys;
  			document.removeEventListener("keydown", typing, false);
  			setTimeout(function(){
  				words.className = "words"; // restart the classes
  				random(); // give another word
  				document.addEventListener("keydown", typing, false);
  			}, 400);
  		}

  	}
}

const TypeList = function(props) {
  words = document.querySelector('.words');
  money = document.querySelector('.money');
  if(props.domos.length === 0)
  {
	 return(
	<div className = "domoList">
	<div className = "moneyWrap">
	  <h3 classname="domoMoney">{cashMoneys}</h3>
	</div>
	<div className="wordsWrap">
	  <h3 className="words">Press any button to start</h3>
	</div>
	</div>
  ); 
  }
  const domoNodes = props.domos.map(function(domo){
		//cashMoneys=props.domos[props.domos.length-1].money;
		//console.log(props.domos[props.domos.length-1]);
		return(
			<div key={domo._id} className="domo">
				<h3 className="domoMoney"> Money: {domo.money}</h3>
			</div>
		);
	});
	return(
		<div className = "domoList">
		  <div className = "moneyWrap">
		    <h3 classname="domoMoney">{cashMoneys}</h3>
		  </div>
		  <div className="wordsWrap">
		    <h3 className="words">Press any button to start</h3>
		  </div>
		</div>
	);
  
};

const loadDomosFromServer = () =>{
	sendAjax('GET', '/getDomos',null,(data)=>{
		ReactDOM.render(
			<TypeList domos={data.domos}/>,document.querySelector("#domos")
		);
	});
};

const setup = function(csrf) {
	ReactDOM.render(
		<DomoForm csrf ={csrf}/>,document.querySelector("#makeDomo")
	);
	ReactDOM.render(
		<TypeList domos={[]}/>, document.querySelector("#domos")
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