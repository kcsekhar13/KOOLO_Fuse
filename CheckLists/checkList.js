var Observable = require('FuseJS/Observable');
var bundle = require('FuseJS/Bundle');
var UserSettings = require('UserSettings');
var Storage = require('FuseJS/Storage');
var State = require("State");

var checkListFile = "checklist.json";
var transitionsFile = "transitions.json";

var selected = Observable();
var newCheckListText = Observable();
var selectedList = Observable();

var finishedGoalsCount = Observable('0');
var finishedTransitionCount = Observable('0');

var totalGoalsCount = Observable();
var totalTransitionsCount = Observable();

var CheckList = {
    Goals : Observable(),
    Transitions : Observable()
};

var newCheckListItem = {
  id : Observable(),
  notes:Observable()
};

var updatedNotes = Observable();

function CheckListItem(checkListId,item,itemStatus,statusIcon) {
  var self = this;
  this.id = checkListId;
  this.notes = item;
  this.status = Observable(itemStatus);
  this.statusIcon = Observable(statusIcon);
  this.IsActive = Observable();
}

var statusIcon = {
	NotDone: "Assets/red.png",
	WorkignOnIt: "Assets/yellow.png",
	Finished: "Assets/green.png",
  InActive:""
}

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
  console.log("SelectedList item Count : " + selectedList.length);
  totalGoalsCount.value =  CheckList.Goals.length;
  for (var i = 0; i < CheckList.Goals.length; i++){
    var currentGoal = CheckList.Goals[i];
    var temp  = new CheckListItem(currentGoal.id,currentGoal.notes,currentGoal.status,currentGoal.statusIcon);
    selectedList.add(temp);
  }
}

function selectTransition() {
  console.log("SelectedList item Count : " + selectedList.length);
  totalTransitionsCount.value =  CheckList.Transitions;
  for (var i = 0; i < CheckList.Transitions.length; i++){
    var current = CheckList.Transitions[i];
    var temp  = new CheckListItem(current.id,current.notes,current.status,current.statusIcon);
    selectedList.add(temp);
  }
};

function InitMyHealthPage() {
  selectedList.clear();
  selected.value = "My Health";
  newCheckListText.value ="New Goal";
  loadGoals();
  selectMyHealth();
}

function InitTransitionPage() {
  selectedList.clear();
  selected.value = "Ready for transition";
  newCheckListText.value ="Transition";
  loadTransitions();
  selectTransition();
}

function Print(arg) {
  console.log( " Print" +JSON.stringify(arg));
}

function loadGoals() {
  console.log("Load CheckList Goals" + CheckList.Goals.length);
  if(CheckList.Goals.length == 0){
    Storage.read(checkListFile).then(function (content) {
              console.log("Success in reading KOOLO checklist");
              CheckList.Goals = JSON.parse(content);
              selectMyHealth();
            },function (error) {
              console.log("Failed to read checklist file");
              readDefaultCheckLists();
    });
  }
};

function loadTransitions() {
  console.log("Load CheckList transitions" + CheckList.Transitions.length);
  if(CheckList.Transitions.length == 0){
    Storage.read(transitionsFile).then(function (content) {
              console.log("Success in reading KOOLO transition");
              CheckList.Transitions = JSON.parse(content);
              selectTransition();
            },function (error) {
              console.log("Failed to read checklist file");
              readDefaultCheckLists();
    });
  }
}

function checkIfCheckListFileExists() {
    loadCheckListGoals();
};

function loadCheckListTransitions() {
  Storage.read(transitionsFile).then(function (content) {
            console.log("Success in reading KOOLO transition");
            CheckList.Transitions = JSON.parse(content);
            totalTransitionsCount.value = CheckList.Transitions.length;
            var goalTemp = 0;
            for (var t in CheckList.Transitions) {
                if(CheckList.Transitions[t].item.status == 3)
                goalTemp++;
            };
            finishedTransitionCount.value = goalTemp;
            console.log("Finished Transition Count " + finishedTransitionCount.value);
            },function (error) {
            console.log(error);
            readDefaultCheckLists();
  });
}

function loadCheckListGoals() {
  Storage.read(checkListFile).then(function (content) {
            CheckList.Goals = JSON.parse(content);
            totalGoalsCount.value = CheckList.Goals.length;
            console.log("Success in reading KOOLO checklist");
            var transTemp = 0;
            for (var t in CheckList.Goals) {
                if(CheckList.Goals[t].status == "3")
                transTemp++;
            };
            finishedGoalsCount.value = transTemp;
            console.log("Finished goals Count " + finishedGoalsCount.value);
            loadCheckListTransitions();
          },function (error) {
          readDefaultCheckLists();
  });
}

function updateCheckListCount() {
  totalTransitionsCount.value = CheckList.Transitions.length;
  totalGoalsCount.value = CheckList.Goals.length;
  var goalTemp = 0;
  for (var t in CheckList.Transitions) {
      if(CheckList.Transitions[t].status == 3)
      goalTemp++;
  };
  finishedTransitionCount.value = goalTemp;
  var transTemp = 0;
  for (var t in CheckList.Goals) {
      if(CheckList.Goals[t].status == 3)
      transTemp++;
  };
  finishedGoalsCount.value = transTemp;
}

function readDefaultCheckLists() {
  bundle.read("CheckLists/CheckList.json").then(function(content)
  {
      console.log("Success in reading checkList file");
      CheckList = JSON.parse(content);
      Storage.write(checkListFile, JSON.stringify(CheckList.Goals, undefined, '    ')).then(function(success) {
           console.log("Save " + checkListFile +  (success ? " success" : "failure"));
      },function (error) {
         console.log("Error in writing CheckListfile");
      });
      Storage.write(transitionsFile, JSON.stringify(CheckList.Transitions, undefined, '    ')).then(function(success) {
           console.log("Save " + transitionsFile +  (success ? " success" : "failure"));
      },function (error) {
         console.log("Error in writing transitionsFile");
      });
  });
};

function updateCheckListItemStatus(arg) {
  if(arg.data.status.value == "1"){
    arg.data.status.value ="2";
    arg.data.statusIcon.value = statusIcon.WorkignOnIt;
  }
  else if(arg.data.status.value == "2"){
    arg.data.status.value ="3";
    arg.data.statusIcon.value = statusIcon.Finished;
    var itemNotes = arg.data.notes;
    selectedList.removeWhere(function(checklist) {
      return checklist.notes == arg.data.notes;
    });
    var id = selectedList.length+1;
    selectedList.add(new CheckListItem(id,itemNotes,"3",statusIcon.Finished));
  }
  else if(arg.data.status.value == "3"){
    arg.data.status.value ="1";
    arg.data.statusIcon.value = statusIcon.NotDone;
  }
  console.log("Saving CheckListItem status");
  saveCheckList();
}

function addNewCheckListItem() {
  console.log("Adding new checklist to " + selected.value);
  var newNotes = newCheckListItem.notes.value;
  if(newNotes.length > 0){
    addToSelectedList(newNotes);
    saveCheckList();
    clearCheckListItem();
  }
}

function updateCheckListItemClicked(item) {
  newCheckListItem.id.value = item.data.id;
  newCheckListItem.notes.value = item.data.notes;
  updatedNotes.value = item.data.notes;
};

function updateCheckListItem() {
    console.log("Update checkListItem" + JSON.stringify(newCheckListItem.id));
    selectedList.removeWhere(function(checklist) {
      return checklist.id == newCheckListItem.id.value;
    });
    var updatedValue = updatedNotes.value;
    addToSelectedList(updatedValue);
    clearUpdateCheckListItem();
}

function clearCheckListItem() {
  console.log("Clear newCheckListItem value");
   newCheckListItem.id.value = "";
   newCheckListItem.notes.value = "";
}

function initNewGoalPage() {
  clearCheckListItem();
}

function clearUpdateCheckListItem() {
  updatedNotes.clear();
};

function deleteCheckListItem(item) {
  console.log("Delete Checklist Item : " + JSON.stringify(item));
  selectedList.removeWhere(function(checklist) {
    return checklist.notes == item.data.notes;
  });
};

function addToSelectedList() {
  console.log("new checklist string length" + newCheckListItem.notes.length);
  if(newCheckListItem.notes.length > 0){
    addToSelectedList(newCheckListItem.notes);
  }
};

function addToSelectedList(value) {
  var id = selectedList.length+1;
  selectedList.add( new CheckListItem(id,value,"1",statusIcon.NotDone));
};

function saveCheckList() {
  var list = [];
  selectedList.forEach(function(param) {
    list.push({id:param.id, notes:param.notes, status:param.status.value, statusIcon:param.statusIcon.value});
  });
  console.log(selected.value);
  if(selected.value == "My Health"){
    console.log("Saving new Checklist goals");
    State.createFile(checkListFile,list);
  }
  else {
    console.log("Saving new Checklist Transitions");
    State.createFile(transitionsFile,list);
  }
};

function Load() {
  console.log("Reading CheckLists file");
  checkIfCheckListFileExists();
  //readDefaultCheckLists();
};

function gotoHome() {
  router.goBack();
}

Load();

module.exports = {
  Load:Load,
  save:saveThreeSentenses,
  readThreeSentenses:readThreeSentenses,
  selected:selected,
  selectedList:selectedList,
  newCheckListText:newCheckListText,
  InitMyHealthPage:InitMyHealthPage,
  InitTransitionPage:InitTransitionPage,
  updateCheckListItemStatus:updateCheckListItemStatus,
  first:threeSentenses.first,
  second:threeSentenses.second,
  third:threeSentenses.third,
  finishedGoalsCount:finishedGoalsCount,
  finishedTransitionCount:finishedTransitionCount,
  totalGoalsCount,totalGoalsCount,
  totalTransitionsCount:totalTransitionsCount,
  updateCheckListCount:updateCheckListCount,
  addNewCheckListItem:addNewCheckListItem,
  updateCheckListItemClicked:updateCheckListItemClicked,
  deleteCheckListItem:deleteCheckListItem,
  newCheckListItem:newCheckListItem,
  initNewGoalPage:initNewGoalPage,
  updateCheckListItem:updateCheckListItem,
  clearCheckListItem:clearCheckListItem,
  updatedNotes:updatedNotes,
  clearUpdateCheckListItem:clearUpdateCheckListItem,
  gotoHome:gotoHome,
  clearCheckListItem:clearCheckListItem
}
