var Observable = require("FuseJS/Observable");
var Storage = require('FuseJS/Storage');
var bundle = require('FuseJS/Bundle');

var State = require("State");

var defaultQuoteFile = "myquote.txt";

var currentPage = Observable("Home");

var navigateToPage = Observable();

var isSettingsVisible = Observable("Hidden");

var myQuote = Observable();

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

function setMyQuote(){
  Storage.read(defaultQuoteFile).then(function(content) {
      myQuote.value = content;
      console.log("Success in reading my quote value");
    }, function(error) {
      console.log("failed to read quotes enabled file");
  });
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

// function HideSettings(argument) {
// 	isSettingsVisible = "Collapsed";
// }

function initializeHomePage() {
  console.log("Initializing home page.");
  setMyQuote();
  bundle.read("appSettings.json").then(function(content) {
  			},      function(error) {
  			    console.log(error);
  	});
}

function changeBackGround(argument) {
	console.log("Change BackGroundImage");
}

initializeHomePage();

module.exports =  {
  initializeHomePage:initializeHomePage,
	changeBackGround :changeBackGround,
	currentPage: currentPage,
	isSettingsPageVisible:isSettingsVisible,
	navigateToPage : navigateToPage,
	gotoPageSettingsPage: GotoPageSettings,
	dateColor : dateColor,
	updateDateColor:updateDateColor,
	myQuote:myQuote,
  homourColors:homourColors,
};
