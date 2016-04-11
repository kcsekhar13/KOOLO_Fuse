var Observable = require('FuseJS/Observable');

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

module.exports={
  first:threeSentenses.first,
  second:threeSentenses.second,
  thirs:threeSentenses.third,
  save:saveThreeSentenses,
  readThreeSentenses:readThreeSentenses
}
