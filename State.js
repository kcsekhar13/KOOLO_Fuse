var Observable = require("FuseJS/Observable");
var Storage = require("FuseJS/Storage");

function InitPage() {
  // Storage.read("quotes.txt").then(function(content) {
  //     console.log("Reading quotes enabled flag success " + content);
  //     isQuoteSet.value = true;
  //   }, function(error) {
  //     console.log("failed to read quotes enabled file");
  //     isQuoteSet.value = true;
  //   });
  //
  //   Storage.read("passcode.txt").then(function(content) {
  //       console.log("Reading passcode enabled flag success " + content);
  //       isPassCodeSet.value = true;
  //   }, function(error) {
  //       console.log("failed to read passcode enabled file");
  //       isPassCodeSet.value = false;
  //   });
}

function createFile(fileName, contents) {
  Storage.write(fileName, contents).then(function(success) {
      console.log("Save " + fileName +  (success ? " success" : "failure"));
  });
};

function deleteFile(arg) {
  //read arguments and delete appropriate file
  // storage.deleteSync("filename.txt");
};

InitPage();

module.exports = {
  createFile:createFile,
  deleteFile:deleteFile,
};
