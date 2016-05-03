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
  QuotesEnabledSwitchFile:QuotesEnabledSwitchFile,
  PassCodeEnabledSwichFile:PassCodeEnabledSwichFile,
  enableQuotesSwitch:enableQuotesSwitch,
  disableQuotesSwitch :disableQuotesSwitch,
  enablePassCodeSwitch:enablePassCodeSwitch,
  disablePassCodeSwitch:disablePassCodeSwitch,  
  myQuoteEnabled:myQuoteEnabled,
  myPassCodeEnabled:myPassCodeEnabled
};
