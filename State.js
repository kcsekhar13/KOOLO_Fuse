var Storage = require("FuseJS/Storage");

function create(fileName, contents) {
  Storage.write(fileName, contents).then(function(success) {
      console.log("Save " + fileName +  (success ? "success" : "failure"));
  });
  
}
