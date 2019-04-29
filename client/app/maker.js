const list = ['CONJUGATIONS','EXTRAVAGANZA','ENTANGLEMENT','JOURNALIZING','CIRCUMJACENT','EXTRAPOLATE','OUTSTANDING',
			  'DESTRUCTION','ACCOMMODATE','RAZZAMATAZZ','JABBERWOCKY','DRIZZLINGLY','COMMUNIZING','ZYGOMORPHIC',
			  'CHOCKABLOCK','EPOXIDIZING','FUTURISTIC','ARITHMETIC','PUNISHMENT','CONSCIENCE','BEMUZZLING','ZIGZAGGING',
			  'DAZZLINGLY','PSYCHOTIC','BUZZWORDS','SUBSCRIBE','BEAUTIFUL','TREATMENT','QUIZZICAL','PLAYWRIGHT',
			  'HUZZAHING','SCHNOZZLE','CAUTIOUS','MANIACAL','CONTINUE','EMBEZZLE','ZYZZYVAS','FLAPJACK','CONSULT',
			  'IDIOTIC','TREMBLE','JOURNEY','APPLAUD','PUNGENT','BOTTLE','COPPER','CREDIT','DEGREE','SUPPLY','REPAIR',
			  'GOVERN','RHYTHM','SYZYGY','MONEY','GUSTY','SHAPE','MURKY','LUCKY','SALTY','WEAVE','CHIN','CHAT','GOOD','YOKE',
			  'YOLK','JINX','JAVA','GOD','DOG','LEG','BOY','BAD','SPY','EGG','GYM'];
let letters = 0;
let typed;
let cashMoneys = 0; //money variable
let multiplier = 1;
let multCost = 10 + (multiplier*multiplier);
let moneyTime = 0;
let timeCost = 10 + (moneyTime*moneyTime);
let spans;
let words;
let money;
let nowTime;
let checkTime;
let wordCount = 20;
let wordCost = (wordCount*wordCount) - 350;


//handles money, name needs to be changed
const handleMoney = (e) => {
	e.preventDefault(0);
	
	sendAjax('POST', $("#moneyForm").attr("action"), $("#moneyForm").serialize(),function(){
		loadMoneysFromServer();
	});
	
	return false;
};
//the form for submission/saving at the top
const MoneyForm = (props) => {
	return(
	  <form id="moneyForm"
		onSubmit={handleMoney}
		name="moneyForm"
		action="/maker"
		method="POST"
		className="money"
	  >
	  <label htmlFor="money">Money: </label>
	  <input id="inputMoney" type="text" name="money"/>
	  <input id="multiplier" type="hidden" name="multiplier"/>
	  <input id="multCost" type="hidden" name="multCost"/>
	  <input id="moneyTime" type="hidden" name="moneyTime"/>
	  <input id="timeCost" type="hidden" name="timeCost"/>
	  <input id="wordCount" type="hidden" name="wordCount"/>
	  <input id="wordCost" type="hidden" name="wordCost"/>
	  <input type="hidden" name="_csrf" value={props.csrf}/>
	  <input className="makeMoneySubmit" type="submit" value="Save"/>
	  </form>
	);
};
//random word choice function
function random() {
    words.innerHTML = "";
    let random = Math.floor(Math.random() * (wordCount));
    let wordArray = list[random].split("");
    for (let i = 0; i < wordArray.length; i++) { //building the words with spans around the letters
        let span = document.createElement("span");
        span.classList.add("span");
        span.innerHTML = wordArray[i];
        words.appendChild(span);
    }
    spans = document.querySelectorAll(".span");
}
//typing function
function typing(e) {
	if(String.fromCharCode(e.which)==="1")
	{
		if(cashMoneys >= multCost)
		{
		  multiplier += 1;
		  cashMoneys -= multCost;
		  multCost = 10 + (multiplier*multiplier*multiplier);
		  document.querySelector("#multiplier").value = multiplier;
		  document.querySelector("#multCost").value = multCost;
		  document.querySelector("#inputMoney").value = cashMoneys;
		  ReactDOM.render(
			<TypeList moneys={cashMoneys} multiplier={multiplier} multCost={multCost} moneyTime={moneyTime} timeCost={timeCost} wordCount={wordCount} wordCost={wordCost}/>,document.querySelector("#moneys")
		  );
		}
	}
	else if(String.fromCharCode(e.which)==="2")
	{
		if(cashMoneys >= timeCost)
		{
		  moneyTime += 1;
		  cashMoneys -= timeCost;
		  timeCost = 10 + (moneyTime*moneyTime*moneyTime);
		  document.querySelector("#moneyTime").value = moneyTime;
		  document.querySelector("#timeCost").value = timeCost;
		  document.querySelector("#inputMoney").value = cashMoneys;
		  ReactDOM.render(
			<TypeList moneys={cashMoneys} multiplier={multiplier} multCost={multCost} moneyTime={moneyTime} timeCost={timeCost} wordCount={wordCount} wordCost={wordCost}/>,document.querySelector("#moneys")
		  );
		}
	}
	else if(String.fromCharCode(e.which)==="3")
	{
		if(cashMoneys >= wordCost && wordCount < 75)
		{
		  wordCount += 5;
		  cashMoneys -= wordCost;
		  wordCost = (wordCount*wordCount) - 350;
		  document.querySelector("#wordCount").value = wordCount;
		  document.querySelector("#wordCost").value = wordCost;
		  document.querySelector("#inputMoney").value = cashMoneys;
		  ReactDOM.render(
			<TypeList moneys={cashMoneys} multiplier={multiplier} multCost={multCost} moneyTime={moneyTime} timeCost={timeCost} wordCount={wordCount} wordCost={wordCost}/>,document.querySelector("#moneys")
		  );
		}
	}
	else
	{
	  if(!spans){
		random();
		return;
	  }
  	  typed = String.fromCharCode(e.which);
  	  for (let i = 0; i < spans.length; i++) {
		if (spans[i].innerHTML === typed) { // if typed letter is the one from the word
			if (spans[i].classList.contains("bg")) { // if it already has class with the background color then check the next one
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
  			cashMoneys += 1*(multiplier); // increment the cashMoneys
			document.querySelector("#inputMoney").value = cashMoneys;
  			document.removeEventListener("keydown", typing, false);
  			setTimeout(function(){
  				words.className = "words"; // restart the classes
  				random(); // give another word
  				document.addEventListener("keydown", typing, false);
  			}, 400);
  		}

  	  }
	}
}
//the html elements to fill in the middle of the screen
const TypeList = function(props) {
  //if brand new
  if(!props.moneys && wordCount<75)
  {
	return(
	  <div className = "moneyList">
	    <div className = "moneyWrap">
	    </div>
		<div className="wordsWrap">
		  <h2 className="words">Press any button to start</h2>
		</div>
		<div className="upgradeWrap">
		  <h3>Upgrades</h3>
		  <h4>Press the corresponding number to upgrade the ability</h4>
		  <h5 id="upgrade1">(${multCost}) 1. Multiplier: {multiplier}x -> {multiplier + 1}x</h5>
		  <h5 id="upgrade2">(${timeCost}) 2. Money over time: ${moneyTime} / 5 seconds -> ${moneyTime + 1} / 5 seconds</h5>
		  <h5 id="upgrade3">(${wordCost}) 3. More words: {wordCount} -> {wordCount + 5}</h5>
		</div>
	  </div>
	); 
  }
  else if(!props.moneys && wordCount>=75)
  {
	return(
	  <div className = "moneyList">
	    <div className = "moneyWrap">	 
	    </div>
		<div className="wordsWrap">
		  <h2 className="words">Press any button to start</h2>
		</div>
		<div className="upgradeWrap">
		  <h3>Upgrades</h3>
		  <h4>Press the corresponding number to upgrade the ability</h4>
		  <h5 id="upgrade1">(${multCost}) 1. Multiplier: {multiplier}x -> {multiplier + 1}x</h5>
		  <h5 id="upgrade2">(${timeCost}) 2. Money over time: ${moneyTime} / 5 seconds -> ${moneyTime + 1} / 5 seconds</h5>
		  <h5 id="upgrade3">(MAX) 3. More words: {wordCount}</h5>
		</div>
	  </div>
    ); 
  }
  else if(wordCount>=75)
  {
	return(
	  <div className = "moneyList">
	    <div className = "moneyWrap">	 
	    </div>
		<div className="wordsWrap">
		  <h2 className="words">Press any button to start</h2>
		</div>
		<div className="upgradeWrap">
		  <h3>Upgrades</h3>
		  <h4>Press the corresponding number to upgrade the ability</h4>
		  <h5 id="upgrade1">(${multCost}) 1. Multiplier: {multiplier}x -> {multiplier + 1}x</h5>
		  <h5 id="upgrade2">(${timeCost}) 2. Money over time: ${moneyTime} / 5 seconds -> ${moneyTime + 1} / 5 seconds</h5>
		  <h5 id="upgrade3">(MAX) 3. More words: {wordCount}</h5>
		</div>
	  </div>
    ); 
  }
  else
  {
	return(
		<div className = "moneyList">
		  <div className = "moneyWrap">
		    
		  </div>
		  <div className="wordsWrap">
		    <h2 className="words">Press any button to start</h2>
		  </div>
		  <div className="upgradeWrap">
		  <h3>Upgrades</h3>
		  <h4>Press the corresponding number to upgrade the ability</h4>
		  <h5 id="upgrade1">(${props.multCost}) 1. Multiplier: {props.multiplier}x -> {props.multiplier + 1}x</h5>
		  <h5 id="upgrade2">(${props.timeCost}) 2. Money over time: ${props.moneyTime} / 5 seconds -> ${props.moneyTime + 1} / 5 seconds</h5>
		  <h5 id="upgrade3">(${props.wordCost}) 3. More words: {props.wordCount} -> {props.wordCount + 5}</h5>
		</div>
		</div>
	);
  }
};

//loads the server variables
const loadMoneysFromServer = () =>{
	sendAjax('GET', '/getMoneys',null,(data)=>{
		words = document.querySelector('.words');
		money = document.querySelector('.money');
		if(data.moneys.length > 0)
		{
			cashMoneys = data.moneys[data.moneys.length-1].money;
			multiplier = data.moneys[data.moneys.length-1].multiplier;
			multCost = data.moneys[data.moneys.length-1].multCost;
			moneyTime = data.moneys[data.moneys.length-1].moneyTime;
			timeCost = data.moneys[data.moneys.length-1].timeCost;
			wordCount = data.moneys[data.moneys.length-1].wordCount;
			wordCost = data.moneys[data.moneys.length-1].wordCost;
			ReactDOM.render(
				<TypeList moneys={cashMoneys} multiplier={multiplier} multCost={multCost} moneyTime={moneyTime} timeCost={timeCost} wordCount={wordCount} wordCost={wordCost}/>,document.querySelector("#moneys")
			);
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
const setup = function(csrf) {
	setInterval(function()
	{ 
		cashMoneys += moneyTime;
		document.querySelector("#inputMoney").value=cashMoneys;
	},5000);
	ReactDOM.render(
		<MoneyForm csrf ={csrf}/>,document.querySelector("#makeMoney")
	);
	ReactDOM.render(
		<TypeList moneys={0}/>, document.querySelector("#moneys")
	);
	
	loadMoneysFromServer();
};

const getToken = () => {
	sendAjax('GET','/getToken',null,(result)=>{
		setup(result.csrfToken);
	});
};
//After page loaded, calls getToken
$(document).ready(function(){
	getToken();
});
//used for starting our typing adventure
document.addEventListener("keydown", typing, false);