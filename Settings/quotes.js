var Observable = require("FuseJS/Observable");
var Storage = require('FuseJS/Storage');
var State = require("State");
var UserSettings = require('UserSettings');

var quotesFile = "quotes.json";
var selectedQuote = Observable();
var newQuote = Observable();
var quotesEnabledSwitch  = Observable(true);

function Quote(quote,isSelected) {
  var self = this;
  this.quote = quote;
  this.IsSelected = isSelected;
};

var defaultQuotes = Observable(
  {quote:"In the midst of winter, i found there was within me , an invincible summer", IsSelected:Observable(false)},
  {quote:"If you're going through hell, keep going", IsSelected:Observable(false)},
  {quote:"If your dreams don't scare you, they are not big enough", IsSelected:Observable(false)},
  {quote:"The only time you should ever look back is to see how far you've come", IsSelected:Observable(false)},
  {quote:"Nothing can dim the light which shines from within", IsSelected:Observable(false)},
  {quote:"When something bad happens you have three choices. You can let it define you, let it destroy you, or you can let it strengthen you.", IsSelected:Observable(false)},
  {quote:"People cry, not because they're weak.It's because they've been strong for too long. - Johnny Deep", IsSelected:Observable(false)},
  {quote:"Those who fly solo have the strongest wings", IsSelected:Observable(false)},
  {quote:"The struggle is part of the story",IsSelected:Observable(false)},
  {quote:"H.O.P.E - Hold On Pains Ends",IsSelected:Observable(false)},
  {quote:"I'm sick and tired of being sick and tired",IsSelected:Observable(false)}
);

function addNewQuote(arg) {
  console.log(newQuote.value);
  // console.log("Length before adding " + defaultQuotes.length);
  defaultQuotes.add({ quote:newQuote.value , IsSelected:Observable(false)});
  save();
  InitializePage();
  newQuote.value = "";
}

function getValues(observables) {
    var result =[];
    console.log("Quotes length" + JSON.stringify(observables['_values'].length));
    for (var i = 0; i < observables['_values'].length; i++){
        var temp = observables['_values'][i];
        var item = new Quote(temp.quote,temp.IsSelected.value);
        result.push(item);
    }
    return result;
}

function save(){
    Storage.write(quotesFile, JSON.stringify(getValues(defaultQuotes))).then(function(success) {
        console.log("Save " + (success ? "success" : "failure"));
    });
}

function writeDefaultQuote(myQuote) {
    UserSettings.setString('defaultQuote', myQuote);
}

function changeDefaultQuote(arg){
  console.log("Selected Quote :" + JSON.stringify(arg.data.quote));
  selectedQuote.value = arg.data.quote;
  writeDefaultQuote(arg.data.quote);
  InitializePage();
}

function setDefaultQuote() {
    for (var i = 0; i < defaultQuotes['_values'].length; i++){
        if(defaultQuotes['_values'][i].quote == selectedQuote.value){
          defaultQuotes['_values'][i].IsSelected.value = true;
        }
        else{
            defaultQuotes['_values'][i].IsSelected.value = false;
        }
    }
    newQuote.value = "";
};

function readQuotesSwitchValue() {
  Storage.read(State.QuotesEnabledSwitchFile).then(function(content) {
      console.log("Reading quotes enabled flag success : " + content);
      quotesEnabledSwitch.value = content;
    }, function(error) {
      console.log("failed to read quotes enabled file");
      quotesEnabledSwitch.value = false;
    });
}
function InitializePage(){
  // Storage.read("quotes.json").then(function(content) {
  //       console.log("Loading quotes from storage");
  //       var temp = JSON.parse(content);
  //       defaultQuotes.clear();
  //       for (var quote in temp) {
  //         defaultQuotes.add({quote:temp[quote].quote,IsSelected:Observable(temp[quote].IsSelected)});
  //       }
  //       setDefaultQuote();
  //   }, function(error) {
  //       console.log("Loading failed - reading default quotes" + error);
  //       setDefaultQuote();
  //   });
  setDefaultQuote();
  readQuotesSwitchValue();
};

quotesEnabledSwitch.addSubscriber(function(x){
    //UserSettings.setString('isQuoteSet', (x.value == true ? "true" :"false"));
    if(x.value == true){
      console.log("Enabling Quotes Switch");
      State.enableQuotesSwitch();
    }
    else {
      console.log("Disabling Quotes Switch : " + x.value);
      State.disableQuotesSwitch();
    }
});

module.exports =  {
    InitializePage :InitializePage,
    defaultQuotes:defaultQuotes,
    newQuote:newQuote,
    addNewQuote : addNewQuote,
    changeDefaultQuote:changeDefaultQuote,
    quotesEnabledSwitch:quotesEnabledSwitch,
};
