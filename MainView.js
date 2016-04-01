var Observable = require("FuseJS/Observable");

var bundle = require('FuseJS/Bundle');

var backGround = Observable();

var data = Observable();

var currentPage = Observable("Home");

var navigateToPage = Observable();

var isSettingsVisible = Observable("Hidden");

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
	backGround = argument;
}

function updateDateColor(color){
	dateColor.color = argument;
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
	dateColor : dateColor
};