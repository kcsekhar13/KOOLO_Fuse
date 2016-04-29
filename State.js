var Observable = require("FuseJS/Observable");
var Storage = require("FuseJS/Storage");

var QuotesEnabledSwitchFile = "quotesSwitch.txt";
var PassCodeEnabledSwichFile = "passcodeSwitch.txt";

var myQuoteEnabled = Observable(false);
var myPassCodeEnabled = Observable(false);

function enableQuotesSwitch() {
  console.log("Enable Quotes Switch");
  createFile(QuotesEnabledSwitchFile,true);
  myQuoteEnabled.value= true;
};

function enablePassCodeSwitch() {
  console.log("Enable PassCode Switch");
  createFile(PassCodeEnabledSwichFile,true);
  myPassCodeEnabled.value = true;
}

function disableQuotesSwitch() {
  console.log("Disable Quotes Switch");
  createFile(QuotesEnabledSwitchFile,false);
  myQuoteEnabled.value = false;
};

function disablePassCodeSwitch() {
    console.log("Disable PassCode Switch");
    createFile(PassCodeEnabledSwichFile,false);
    myPassCodeEnabled.value = false;
}

function createFile(fileName, contents) {
  Storage.write(fileName, contents).then(function(success) {
      console.log("Saving " + fileName +  (success ? " success" : "failure"));
  });
};

function deleteFile(fileName) {
    console.log("Delete file : " + fileName);
    Storage.read(fileName).then(function(content) {
      Storage.deleteSync(fileName);
    }, function(error) {
        console.log("failed to read file" + fileName);
    });
};

function getQuotesAndPassCodeStatus() {
  Storage.read(QuotesEnabledSwitchFile).then(function(content) {
      console.log("Reading quotes enabled flag success " + content);
      myQuoteEnabled.value = content;
    }, function(error) {
      console.log("failed to read quotes enabled file");
    });

    Storage.read(PassCodeEnabledSwichFile).then(function(content) {
        console.log("Reading passcode enabled flag success " + content);
        myPassCodeEnabled.value = content;
    }, function(error) {
        console.log("failed to read passcode enabled file");
    });
};

function InitPage() {
  getQuotesAndPassCodeStatus();
};

InitPage();

module.exports = {
  //createFile:createFile,
  //deleteFile:deleteFile,
  enableQuotesSwitch:enableQuotesSwitch,
  disableQuotesSwitch :disableQuotesSwitch,
  enablePassCodeSwitch:enablePassCodeSwitch,
  disablePassCodeSwitch:disablePassCodeSwitch,
  getQuotesAndPassCodeStatus:getQuotesAndPassCodeStatus,
  myQuoteEnabled:myQuoteEnabled,
  myPassCodeEnabled:myPassCodeEnabled
};
