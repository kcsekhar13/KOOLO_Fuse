var Observable = require("FuseJS/Observable");

var bundle = require('FuseJS/Bundle');

var backGround = Observable();

var data = Observable();

var currentPage = Observable("Home");

var navigateToPage = Observable();

var isSettingsVisible = Observable("Hidden");

var displayedQuoteText = Observable("When something bad happens you have three choices. You can let it define you, let it destroy you, or you can let it strengthen you.");

var homourColors = [
                      { color: [ { code: "#23f38e" }, { title: "Lykkelig" } ] },
                      { color: [ { code: "#ffde47" }, { title: "Glad" } ] },
                      { color: [ { code: "#233fc7" }, { title: "Rolig" } ] },
                      { color: [ { code: "#e62de7" }, { title: "Fremgang" } ] },
                      { color: [ { code: "#f42121" }, { title: "Sing" } ] },
                      { color: [ { code: "#000000" }, { title: "Legg til humer" } ] },
                      { color: [ { code: "#9fb6cd" }, { title: "Legg til humer" } ] },
                      { color: [ { code: "#ff4500" }, { title: "Rolig" } ] },
                      { color: [ { code: "#a52a2a" }, { title: "Sing" } ] }
                  ];

function getValues(observables) {
      var result = {};
      for (var property in observables) {
          result[property] = observables[property].value;
      }
      return result;
  }

function setValues(values, observables) {
    for (var property in values) {
        observables[property].value = values[property];
    }
}

var dateColor = {
			date : Observable(new Date().getDate()),
			colour : Observable()
		};

bundle.read("appSettings.json").then(function(content) {
    			data.value = JSON.parse(content);
    			backGround.value = JSON.parse(content).Settings.BackGroundImage;
			}, function(error) {
			    console.log(error);
			});


function Init() {
	backGround = data.Settings.BackGroundImage;
}

function changeBackGround(argument) {
	console.log("Change BackGroundImage");
}

function updateDateColor(context){
    //console.log(JSON.stringify(argument, undefined, '    '));
	dateColor.colour.value = context.data.code;
	console.log(dateColor.date);
}

function GotoPageSettings(argument) {
	console.log("Go To Settings Page");
	isSettingsVisible = "Visible";
	navigateToPage = "Settings";
}

function HideSettings(argument) {
	isSettingsVisible = "Collapsed";
}

console.log(dateColor.date);

function Clicked(argument) {
	console.log("Clicked");
}

module.exports =  {
	backGround : backGround,
	changeBackGround :changeBackGround,
	currentPage: currentPage,
	clicked : Clicked,
	isSettingsPageVisible:isSettingsVisible,
	navigateToPage : navigateToPage,
	gotoPageSettingsPage: GotoPageSettings,
	dateColor : dateColor,
	updateDateColor:updateDateColor,
	displayedQuoteText:displayedQuoteText,
  homourColors:homourColors,
};
