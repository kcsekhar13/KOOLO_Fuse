var Observable = require("FuseJS/Observable");
var Storage = require('FuseJS/Storage');
var bundle = require('FuseJS/Bundle');
var gallery = require('Gallery');
var camera = require('FuseJS/Camera');
var State = require("State");

var defaultQuoteFile = "myquote.txt";

var currentPage = Observable("Home");

var navigateToPage = Observable();

var isSettingsVisible = Observable("Hidden");

var myQuote = Observable();

var myBackGroundImage = Observable();

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
    date: Observable(new Date().getDate()),
    colour: Observable()
};

function setMyQuote() {
    Storage.read(defaultQuoteFile).then(function(content) {
        myQuote.value = content;
        console.log("Success in reading my quote value");
    }, function(error) {
        console.log("failed to read quotes enabled file");
    });
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
      myBackGroundImage.value = "/data/data/com.KOOLO_Fuse/files/KOOLO_Background.jpg"
    }, function(error) {
      console.log("failed to read BackGroundImage");
      myBackGroundImage.value = "Assets/bg.jpg";
    });
}

function gotoLibrary() {
    gallery.getPicture().then(function(pic) {
				console.log("Received image for Background :"+ JSON.stingify(pic));
    });
}

function getMoodLineImages() {

}

function takePicture(){
  console.log("Taking PictureResult");
  var dateTicks = new Date().getTime();
  camera.takePicture({ targetWidth: 640, targetHeight: 360,correctOrientation: true}).then(function(file)
  {
      console.log("Picture Details " + JSON.stingify(file));
  }).catch(function(e) {
      console.log(e);
  });
}

function initializeHomePage() {
    console.log("Initializing home page.");
    console.log(new Date().getTime());
    setMyQuote();
    readBackGroundImage();
    bundle.read("appSettings.json").then(function(content) {}, function(error) {
        console.log(error);
    });
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
    homourColors: homourColors,
    gotoLibrary:gotoLibrary,
    takePicture:takePicture,
};
