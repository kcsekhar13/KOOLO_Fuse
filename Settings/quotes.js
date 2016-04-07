var Observable = require("FuseJS/Observable");
var Storage = require('FuseJS/Storage');

var quotesFile = "quotes.json";
var quotesEnabledFile = "quotes.txt";
var defaultQuoteFile = "myquote.txt";
var quotesEnabled  = Observable();
var selectedQuote = Observable();
var newQuote = Observable("1");

function setValues(values, observables) {
    for (var property in values) {
        observables[property].value = values[property];
    }
}

function readQuotesEnabledFlag() {
  Storage.read(quotesEnabledFile).then(function(content) {
      console.log("Reading quotes enabled flag " + content);
      quotesEnabled.value = content == "true"? true: false;
    }, function(error) {
      console.log("failed to read quotes enabled file");
      quotesEnabled.value = false;
    });
}

function setQuotesEnabledFlag(arg) {
  console.log("Writing quotes enabled switch : " + arg.toString());
  Storage.write(quotesEnabledFile, arg.toString()).then(function(success) {
      console.log("Save QuotesEnabledFlag " + (success ? "success" : "failure"));
  });
}

quotesEnabled.addSubscriber(function(x){
      if(x.value != undefined){
      console.log("quotes switched changed to : " + x.value);
      setQuotesEnabledFlag(x.value);
    }
});

var defaultQuotes = Observable(
  {quote:"In the midst of winter, i found there was within me , an invincible summer", code:"0" ,IsSelected:Observable(false)},
  {quote:"If you're going through hell, keep going",code:"1", IsSelected:Observable(false)},
  {quote:"If your dreams don't scare you, they are not big enough",code:"2", IsSelected:Observable(false)},
  {quote:"The only time you should ever look back is to see how far you've come",code:"3", IsSelected:Observable(false)},
  {quote:"Nothing can dim the light which shines from within",code:"4", IsSelected:Observable(false)},
  {quote:"When something bad happens you have three choices. You can let it define you, let it destroy you, or you can let it strengthen you.", code:"5", IsSelected:Observable(false)},
  {quote:"People cry, not because they're weak.It's because they've been strong for too long. - Johnny Deep",code:"6", IsSelected:Observable(false)},
  {quote:"Those who fly solo have the strongest wings",code:"7", IsSelected:Observable(false)},
  {quote:"The struggle is part of the story",code:"8", IsSelected:Observable(false)},
  {quote:"H.O.P.E - Hold On Pains Ends",code:"9",IsSelected:Observable(false)},
  {quote:"I'm sick and tired of being sick and tired",code:"10",IsSelected:Observable(false)}
);

function addNewQuote(arg) {
  console.log(newQuote.value);
  // console.log("Length before adding " + defaultQuotes.length);
  defaultQuotes.add({quote:newQuote.value , code:defaultQuotes.length+1,IsSelected:Observable(false)});
  // console.log("Length after adding " + defaultQuotes["_values"]);
  // save();
  Init();
}

function save(){
    console.log("Saving");
    console.log(JSON.stringify(defaultQuotes));
    // console.log(JSON.stringify(argument, undefined, '    '));
     Storage.write(quotesFile, JSON.stringify(getValues(defaultQuotes))).then(function(success) {
         console.log("Save " + (success ? "success" : "failure"));
     });
}

function writeDefaultQuote(myQuote) {
  Storage.write(defaultQuoteFile, myQuote).then(function(success) {
      console.log("Save " + (success ? "success in writing my Quote" : "failure"));
  });
}

function changeDefaultQuote(arg){
  selectedQuote.value = arg.data.code;
  console.log("Selected Quote :" + arg.data.quote);
  writeDefaultQuote(arg.data.quote);
  Init();
}

function Init(){
  readQuotesEnabledFlag();
  Storage.read("quotes.json").then(function(content) {
        console.log("Loading success");
        defaultQuotes = JSON.parse(content);
    }, function(error) {
      console.log("Loading failed - reading default quotes");
      defaultQuotes.forEach(function(myQuote, index) {
          if(myQuote.code.toString() == selectedQuote.value){
            myQuote.IsSelected.value = true;
          }
          else{
              myQuote.IsSelected.value = false;
          }
      });
    });
  newQuote.value = "";
};
Init();

module.exports =  {
    Init :Init,
    quotesEnabled:quotesEnabled,
    defaultQuotes:defaultQuotes,
    newQuote:newQuote,
    addNewQuote : addNewQuote,
    changeDefaultQuote:changeDefaultQuote
};
