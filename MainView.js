var Observable = require("FuseJS/Observable");
var Storage = require('FuseJS/Storage');
var gallery = require('Gallery');
var camera = require('FuseJS/Camera');
var State = require("State");
var UserSettings = require('UserSettings');
var _ = require('Loaddash');

var defaultQuoteFile = "myquote.txt";
var moodMapFile = "moods.json";

var currentPage = Observable("Home");
var navigateToPage = Observable();
var isSettingsVisible = Observable("Hidden");
var myQuote = Observable();
var myBackGroundImage = Observable("Assets/Background.png");
var isPassCodeSet = Observable();
var isQuoteSet = Observable();

var kooloTodayEvents = Observable();
var eventsFile = "events.json";

// With Lodash
function parseLodash(str){
    return _.attempt(JSON.parse.bind(null, str));
}

var MoodMapPage = {
	moodLine: "moodLinePage",
	moodMap: "moodMapPage",
	selectHumour: "selectHumourPage",
	moodMapImage: "moodImagePage"
}
var currentMoodMapImage = Observable();
var moodMapPage = Observable(MoodMapPage.moodLine);
var homourColors =[
	                      { code: "#23f38e", title: Observable("Lykkelig") },
	                      { code: "#ffde47", title: Observable("Glad") },
	                      { code: "#233fc7", title: Observable("Rolig") },
	                      { code: "#e62de7", title: Observable("Fremgang") },
	                      { code: "#f42121", title: Observable("Sing") },
	                      { code: "#000000", title: Observable("Legg til humer") },
	                      { code: "#9fb6cd", title: Observable("Legg til humer") },
	                      { code: "#ff4500", title: Observable("Rolig") },
	                      { code: "#a52a2a", title: Observable("Sing") }
	                  ];
var myMoods = [];
var observableMoods = Observable();
var selectedMood = Observable();
var selectedHumourColor = Observable();

function mood(id,imagePath,color,date) {
  var self = this;
  this.Id = id;
  this.moodImage = imagePath;
  this.moodColor = color;
  this.moodDate = date;
};

function readkooloEvents() {
  Storage.read(eventsFile).then(function(content) {
        var events = JSON.parse(content);
        	kooloTodayEvents.value = events.filter(function(e){
          return e.dateString === new Date().toDateString();;
        });
				console.log("Success in reading koolo events file " + kooloTodayEvents.value.length);
  }, function(error) {
      console.log("failed to read koolo events file");
  });
}

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
    date: Observable(new Date().getDate()),
    colour: Observable()
};

function setMyQuote() {
    myQuote.value  = isQuoteSet.value == "true" ? UserSettings.getString('defaultQuote','H.O.P.E - Hold On Pains Ends') : '';
}

function updateDateColor(context) {
    //console.log(JSON.stringify(argument, undefined, '    '));
    dateColor.colour.value = context.data.code;
    console.log(dateColor.date);
}

function GotoPageSettings(argument) {
    console.log("Go To Settings Page");
    isSettingsVisible = "Visible";
    navigateToPage = "Settings";
}

function readBackGroundImage() {
  Storage.read("KOOLO_Background.txt").then(function(content) {
			console.log(content);
      myBackGroundImage.value = content;
    }, function(error) {
      console.log("failed to read BackGroundImage");
      myBackGroundImage.value = "Assets/Background.png";
    });
}

function gotoLibrary() {
    console.log("Load mood image from Gallery ");
    var ticks = new Date().getTime() + ".jpg";
    gallery.getMoodMapPicture(ticks).then(function(pic) {
        //var moodImagePath = "/data/data/com.KOOLO_Fuse/files/"+ ticks;
				console.log("Received mood map image from gallery" + pic.path);
				currentMoodMapImage.value = pic;
        //var length = myMoods.length+1;
        //myMoods.push(new mood(length,moodImagePath,"Red",new Date().toDateString()));
        //updateMyMoods();
				moodMapPage.value = MoodMapPage.selectHumour;
    },function (eror) {
      console.log("failed to read Mood Map Image form Library");
    });
}

function saveMoodMapImage() {
	var length = myMoods.length+1;
	myMoods.unshift(new mood(length,currentMoodMapImage.value,selectedHumourColor.value,new Date().toDateString()));
	updateMyMoods();
}

function updateMyMoods() {
  observableMoods.value = myMoods;
  Storage.write(moodMapFile, JSON.stringify(myMoods, undefined, '    ')).then(function(success) {
       console.log("Save " + fileName +  (success ? " success" : "failure"));
       getMoodLineImages();
  },function (error) {
     console.log("Error in writing moods to file");
     console.log(error);
  });
}

function getMoodLineImages() {
    Storage.read(moodMapFile).then(function(content) {
        myMoods = JSON.parse(content);
        observableMoods.value = myMoods;
        // console.log(JSON.stringify(observableMoods));
    }, function(error) {
        console.log("failed to read moodMapFile");
    });
}

function takePicture(){
  console.log("Taking mood Picture");
  camera.takePicture({ targetWidth: 640, targetHeight: 360,correctOrientation: true}).then(function(file)
  {
    console.log("Received image from Camera :" + JSON.stringify(file, undefined, '    '));
    var length = myMoods.length+1;
		currentMoodMapImage.value = file;
		//var length = myMoods.length+1;
		//myMoods.push(new mood(length,moodImagePath,"Red",new Date().toDateString()));
		//updateMyMoods();
		moodMapPage.value = MoodMapPage.selectHumour;
    //myMoods.push(new mood(length,file,"Red", new Date().toDateString()))
    //updateMyMoods();
  }).catch(function(e) {
      console.log(e);
  });
}

function onMoodImageClickHandler(arg) {
	selectedMood.value = arg.data;
	console.log(JSON.stringify(selectedMood));
}

function onMoodColorCircleClicked(arg) {
  var filteredMoods = myMoods.filter(function(e){
			    return e.moodColor === arg.data.code;
			});
	//myMoods.clear();
	observableMoods.value = filteredMoods;
}

function clearMoodColorFilter() {
		getMoodLineImages();
}

function onHumorColorSelected(arg) {
	selectedHumourColor.value=arg.data.code;
}

function readSwitchValues() {
	Storage.read(State.QuotesEnabledSwitchFile).then(function(content) {
      console.log("Reading quotes enabled flag success " + content);
      isQuoteSet.value = content;
			setMyQuote();
    }, function(error) {
      console.log("failed to read quotes enabled file");
    });

    Storage.read(State.PassCodeEnabledSwichFile).then(function(content) {
        console.log("Reading passcode enabled flag success " + content);
        isPassCodeSet.value = content;
    }, function(error) {
        console.log("failed to read passcode enabled file");
    });
}

function initializeHomePage() {
    console.log("********** Initializing home page ***************");
    readSwitchValues();
    readBackGroundImage();
		readkooloEvents();
    getMoodLineImages();    
}
function gotoSettings() {
		router.goto("settings");
};

function gotoCalendar() {
	router.goto("calender");
}

function gotoHome() {
	router.goto("home");
}

function gotoMoodMap() {
	router.goto("moodMap");
}

function gotoCheckList() {
	router.goto("checkList");
}

initializeHomePage();

module.exports = {
    initializeHomePage: initializeHomePage,
    myBackGroundImage:myBackGroundImage,
    currentPage: currentPage,
    isSettingsPageVisible: isSettingsVisible,
    navigateToPage: navigateToPage,
    gotoPageSettingsPage: GotoPageSettings,
    dateColor: dateColor,
    updateDateColor: updateDateColor,
    myQuote: myQuote,
    homourColors: homourColors,
    gotoLibrary:gotoLibrary,
    takePicture:takePicture,
    myMoods:myMoods,
    observableMoods:observableMoods,
		moodMapPage: moodMapPage,
		currentMoodMapImage:currentMoodMapImage,
		saveMoodMapImage:saveMoodMapImage,
		onMoodImageClickHandler:onMoodImageClickHandler,
		selectedMood:selectedMood,
		selectedHumourColor:selectedHumourColor,
		onHumorColorSelected:onHumorColorSelected,
		onMoodColorCircleClicked:onMoodColorCircleClicked,
		clearMoodColorFilter:clearMoodColorFilter,
  	getMoodLineImages:  getMoodLineImages,
		kooloTodayEvents:kooloTodayEvents,
		readkooloEvents:readkooloEvents,
		gotoSettings:gotoSettings,
		gotoHome:gotoHome,
		gotoCalendar:gotoCalendar,
		gotoMoodMap:gotoMoodMap,
		gotoCheckList:gotoCheckList
  };
