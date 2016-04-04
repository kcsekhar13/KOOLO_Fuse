var Observable = require("FuseJS/Observable");

		// var settings = ["Background Image","Passcode","Quotes","Humour Color","License","Tutorial","Contributors","About"];
 		var settings = [
	                { setting: "Background Image" },
	                { setting : "Passcode" },
	                {setting : "Quotes" },
	                {setting : "Humour Color" },
	                {setting : "License" },
	                {setting : "Tutorial" },
	                {setting : "Contributors" },
	                {setting : "About" }
	            ];
		var currentPageTitle = Observable();

		var secretAnswer = Observable("AaHooo!");

		// test settings
		var testValue = Observable("testValue");

		var switchValue = Observable(false);

		var quotesEnabled = Observable(false);

		function passcodeSwitchChanged(arg){
			console.log("passcodeSwitchChanged");
		}

		function quotesSwitchChanged(arg) {
			console.log("Quotes Switch Changed");
		}

		var selectedOption = Observable("1");

		var dropdownOptions = Observable(
			{ option: "What is your favourite color?",code: "1"},
			{ option: "What is your pet name?", 		  code: "2"},
			{ option: "Who is your favourite actor?", code: "3"},
			{ option: "What is your favourite color?",code: "4"},
			{ option: "What is your first car?", 			code: "5"},
			{ option: "What is your favourite food?", code: "6"}
		);

		var defaultQuotes = Observable(
			{quote:"In the midst of winter, i found there was within me , an invincible summer",code:"1"},
			{quote:"MyQuotes1",code:"2"},
			{quote:"MyQuotes2",code:"3"},
			{quote:"MyQuotes3",code:"4"},
			{quote:"MyQuotes4",code:"5"},
			{quote:"MyQuotes", code:"6"},
			{quote:"MyQuotes1",code:"7"},
			{quote:"MyQuotes2",code:"8"},
			{quote:"MyQuotes3",code:"9"},
			{quote:"MyQuotes4",code:"10"},
      {quote:"MyQuotes5",code:"11"},
      {quote:"MyQuotes6",code:"12"},
      {quote:"MyQuotes7",code:"13"},
      {quote:"MyQuotes8",code:"14"},
      {quote:"MyQuotes9",code:"15"}
		);
		var newQuote = Observable();

		function addNewQuote(arg) {
			console.log("Add New quote");
		}

		var selected = Observable();

		function selectMe(arg){
			selected.value = arg.data.option;
			selectedOption.value = arg.data.code;
		}

module.exports =  {
		settings: settings,
    currentPageTitle :"Settings",
		passcodeSwitchChanged : passcodeSwitchChanged,
		dropdownOptions: dropdownOptions,
		selected: selected,
		selectMe: selectMe,
		selectedOption: selectedOption,
		secretAnswer:secretAnswer,
		testValue:testValue,
		switchValue: switchValue,
		quotesEnabled:quotesEnabled,
		quotesSwitchChanged:quotesSwitchChanged,
		defaultQuotes:defaultQuotes,
		newQuote:newQuote,
		addNewQuote : addNewQuote
};
