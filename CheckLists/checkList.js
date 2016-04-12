var Observable = require('FuseJS/Observable');

var selected = Observable();
var newCheckListText = Observable();

var threeSentenses = {
  first :Observable(""),
  second:Observable(""),
  third:Observable("")
};

function saveThreeSentenses() {

}

function readThreeSentenses() {

}

function InitPage() {

}

function selectMyHealth() {
  selected.value = "My Health";
  newCheckListText.value ="New Goal";
}

function selectTransition() {
  selected.value = "Ready for transition";
  newCheckListText.value ="Transition";
}

function InitMyHealthPage() {
  selectMyHealth();
}

function InitTransitionPage() {
  selectTransition();
}

function print(arg) {
  console.log( " Print" +JSON.stingify(arg));
}

module.exports={
  save:saveThreeSentenses,
  readThreeSentenses:readThreeSentenses,
  selected:selected,
  newCheckListText:newCheckListText,
  InitMyHealthPage:InitMyHealthPage,
  InitTransitionPage:InitTransitionPage,
  first:threeSentenses.first,
  second:threeSentenses.second,
  third:threeSentenses.third,
}
