var Observable = require('FuseJS/Observable');
var bundle = require('FuseJS/Bundle');
var UserSettings = require('UserSettings');

var selected = Observable();
var newCheckListText = Observable();
var selectedList = Observable();

var CheckList = {
    Goals : Observable(),
    Transitions : Observable()
};

var threeSentenses = {
  first :Observable(""),
  second:Observable(""),
  third:Observable("")
};

function saveThreeSentenses() {
  UserSettings.setString('fistSentense', threeSentenses.first.value );
  UserSettings.setString('secondSentense', threeSentenses.second.value);
  UserSettings.setString('thirdSentense', threeSentenses.third.value);
}

function readThreeSentenses() {
    threeSentenses.first.value = UserSettings.getString('fistSentense', '');
    threeSentenses.second.value =  UserSettings.getString('secondSentense','');
    threeSentenses.third.value =  UserSettings.getString('thirdSentense', '');
}

function selectMyHealth() {
  selected.value = "My Health";
  newCheckListText.value ="New Goal";
    selectedList.clear();
    for (var i = 0; i < CheckList.Goals.length; i++){
      var currentGoal = CheckList.Goals[i];
      var item = {item:Observable()};
      for (var j = 0; j < currentGoal.item.length; j++){
        item.item.add(currentGoal.item[j]);
      }
      selectedList.add(item);
    }
}

function selectTransition() {
  selected.value = "Ready for transition";
  newCheckListText.value ="Transition";
  selectedList.clear();
  for (var i = 0; i < CheckList.Transitions.length; i++){
    var current = CheckList.Transitions[i];
    var item = {item:Observable()};
    for (var j = 0; j < current.item.length; j++){
      item.item.add(current.item[j]);
    }
    selectedList.add(item);
  }
}

function InitMyHealthPage() {
    debug_log("my health from JS");
    selectMyHealth();
}

function InitTransitionPage() {
  selectTransition();
}

function print(arg) {
  console.log( " Print" +JSON.stingify(arg));
}

function Load() {
  bundle.read("CheckLists/CheckList.json").then(function(content) {
      CheckList = JSON.parse(content);
  }, function(error) {
      console.log(" Error reading CheckList file "+ error);
  });
}

Load();

module.exports = {
  save:saveThreeSentenses,
  readThreeSentenses:readThreeSentenses,
  selected:selected,
  selectedList:selectedList,
  newCheckListText:newCheckListText,
  InitMyHealthPage:InitMyHealthPage,
  InitTransitionPage:InitTransitionPage,
  first:threeSentenses.first,
  second:threeSentenses.second,
  third:threeSentenses.third,
}
