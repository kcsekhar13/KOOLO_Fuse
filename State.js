var Observable = require("FuseJS/Observable");
var Storage = require("FuseJS/Storage");

var QuotesEnabledSwitchFile = "quotesSwitch.txt";
var PassCodeEnabledSwichFile = "passcodeSwitch.txt";

var myQuoteEnabled = Observable(false);
var myPassCodeEnabled = Observable(false);

function enableQuotesSwitch() {
  createFile(QuotesEnabledSwitchFile,true);
  myQuoteEnabled.value= true;
};

function enablePassCodeSwitch() {
  createFile(PassCodeEnabledSwichFile,true);
  myPassCodeEnabled.value = true;
}

function disableQuotesSwitch() {
  createFile(QuotesEnabledSwitchFile,false);
  myQuoteEnabled.value = false;
};

function disablePassCodeSwitch() {    
    createFile(PassCodeEnabledSwichFile,false);
    myPassCodeEnabled.value = false;
}

function createFile(fileName, contents) {
  Storage.write(fileName, JSON.stringify(contents)).then(function(success) {
      console.log("Saving " + fileName +  (success ? " success" : "failure"));
  });
};

function deleteFile(fileName) {
    Storage.read(fileName).then(function(content) {
      Storage.deleteSync(fileName);
    }, function(error) {
        console.log("failed to read file" + fileName);
    });
};

module.exports = {
  createFile:createFile,
  deleteFile:deleteFile,
  QuotesEnabledSwitchFile:QuotesEnabledSwitchFile,
  PassCodeEnabledSwichFile:PassCodeEnabledSwichFile,
  enableQuotesSwitch:enableQuotesSwitch,
  disableQuotesSwitch :disableQuotesSwitch,
  enablePassCodeSwitch:enablePassCodeSwitch,
  disablePassCodeSwitch:disablePassCodeSwitch,
  myQuoteEnabled:myQuoteEnabled,
  myPassCodeEnabled:myPassCodeEnabled
};
