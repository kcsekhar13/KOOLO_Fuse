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

    var selected = Observable();

		var selectedOption = Observable("1");

		var dropdownOptions = Observable(
			{ option: "What is your favourite color?",code: "1"},
			{ option: "What is your pet name?", 		  code: "2"},
			{ option: "Who is your favourite actor?", code: "3"},
			{ option: "What is your favourite color?",code: "4"},
			{ option: "What is your first car?", 			code: "5"},
			{ option: "What is your favourite food?", code: "6"}
		);

  function passcodeSwitchChanged(arg){
			console.log("passcodeSwitchChanged");
	}

	function selectMe(arg){
		selected.value = arg.data.option;
		selectedOption.value = arg.data.code;
	}

  function init() {
    console.log("Initializing Settings");
  };

  init();

  module.exports =  {
  		settings: settings,
      currentPageTitle :"Settings",
  		passcodeSwitchChanged : passcodeSwitchChanged,
  		dropdownOptions: dropdownOptions,
  		selected: selected,
  		selectMe: selectMe,
  		selectedOption: selectedOption,
  		secretAnswer:secretAnswer
  };
