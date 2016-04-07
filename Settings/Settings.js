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

    var passCodeSwitch = Observable(true);

    var passCodeTxt = Observable("");

    var txt1Visibility = Observable("Hidden");
    var txt2Visibility = Observable("Hidden");
    var txt3Visibility = Observable("Hidden");
    var txt4Visibility = Observable("Hidden");

		var dropdownOptions = Observable(
			{ option: "What is your favourite color?",code: "1"},
			{ option: "What is your pet name?", 		  code: "2"},
			{ option: "Who is your favourite actor?", code: "3"},
			{ option: "What is your favourite color?",code: "4"},
			{ option: "What is your first car?", 			code: "5"},
			{ option: "What is your favourite food?", code: "6"}
		);

  passCodeSwitch.addSubscriber(function(x) {
      console.log("passcodeSwitchChanged");
  });

  passCodeTxt.addSubscriber(function(x){
        if(x.value != undefined){
        console.log("Entered Passcode : " + x.value + " length : " + x.value.length);
        var i = x.value.length;
          if(i > 0){
          if(i==1) { txt1Visibility.value="Visible"; txt2Visibility.value= txt3Visibility.value = txt4Visibility.value = "Hidden"}
          if(i==2) { txt1Visibility.value =txt2Visibility.value= "Visible"; txt3Visibility.value = txt4Visibility.value = "Hidden";}
          if(i==3) {txt1Visibility.value =txt2Visibility.value= txt3Visibility.value = "Visible"; txt4Visibility.value = "Hidden";}
          if(i==4) {txt1Visibility.value =txt2Visibility.value= txt3Visibility.value = txt4Visibility.value = "Visible";}
          }
          if(i==0){
            txt1Visibility.value =txt2Visibility.value= txt3Visibility.value = txt4Visibility.value = "Hidden";
          }
      }
  });

  function clearPassCodeText() {
    passCodeTxt.value="";
    txt1Visibility.value =txt2Visibility.value= txt3Visibility.value = txt4Visibility.value = "Hidden";
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
  		dropdownOptions: dropdownOptions,
  		selected: selected,
  		selectMe: selectMe,
  		selectedOption: selectedOption,
  		secretAnswer:secretAnswer,
      passCodeSwitch: passCodeSwitch,
      passCodeTxt:passCodeTxt,
      clearPassCodeText,clearPassCodeText,
      txt1Visibility:txt1Visibility,
      txt2Visibility:txt2Visibility,
      txt3Visibility:txt3Visibility,
      txt4Visibility:txt4Visibility
  };
