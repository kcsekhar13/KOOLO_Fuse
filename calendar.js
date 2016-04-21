var Observable = require("FuseJS/Observable");

var selectedDate = Observable();
var currentYear = Observable();
var currentMonth = Observable();
var currentDate = Observable();
var todayDate = Observable();
var currentDayInWeek = Observable();
var totalDaysInMonth = Observable();
var validDays = Observable();
var hours= [];
var minutes= [];
var myEvents = [];

function myDay(date, isContainsEvents){
   var self = this;
   this.date = date;
   this.isSelected = selectedDate.map(function(x){
     return x === self.date;
   });
   this.isCurrentDay = todayDate.map(function(x){
     return x === self.date;
   });
   this.isContainsEvents = Observable();
 }

var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function initPage() {
  validDays = Observable();
  initCalendar(new Date());
  for (var i = 0; i < 24; i++) {
    hours.push(i);
  }
  for (var i = 0; i < 60; i++) {
    minutes.push(i);
  }
    // todayDate.value = new Date().getDate();
  // currentDate.value = new Date().toDateString();
  // currentMonth.value = new Date().getMonth()+1;
  // currentYear.value = new Date().getFullYear();
  // currentDayInWeek.value= new Date().getDay();
  // totalDaysInMonth.value = daysInMonth(currentMonth.value,currentYear.value);
  //
  // for (var i = 0; i < currentDayInWeek.value; i++) {
  //   validDays.push(new myDay('',false) );
  // }
  // for (var i = 1; i <= totalDaysInMonth.value; i++) {
  //   validDays.push(new myDay(i,false));
  // }
  // console.log("Year  " +   currentYear.value + " Month :" + currentMonth.value);
  // console.log("Total days in current month " + totalDaysInMonth.value);
  // console.log("validDays count " +validDays.length );
}

function initCalendar(date) {
  validDays.clear();
  console.log("validDays count " +validDays.length );
  // console.log( "Updating calender to new date" +JSON.stringify(date, undefined, '    '));
  var d = new Date(date);
  todayDate.value = d.getDate();
  currentDate.value = d.toDateString();
  currentMonth.value = d.getMonth()+1;
  currentYear.value = d.getFullYear();
  currentDayInWeek.value= new Date(currentYear.value,d.getMonth(),1).getDay();
  totalDaysInMonth.value = daysInMonth(currentMonth.value,currentYear.value);

  for (var i = 0; i < currentDayInWeek.value; i++) {
    validDays.add(new myDay('',false) );
  }
  for (var i = 1; i <= totalDaysInMonth.value; i++) {
    validDays.add(new myDay(i,false));
  }
  console.log("Year  " +   currentYear.value + " Month :" + currentMonth.value);
  console.log("Total days in current month " + totalDaysInMonth.value);
  console.log("validDays count " +validDays.length );
}

function onDateSelected(date) {
  console.log(JSON.stringify(date));
  selectedDate.value = date.data.date;
}

function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}

function showNextMonth() {
    selectedDate.value = 0;
    console.log("Displaying next month " + currentMonth.value);
    if(currentMonth.value == 11){
      currentYear.value = currentYear.value+1;
      currentMonth.value = 1;
    }
    currentMonth.value = currentMonth.value;
    var newDate = new Date(currentYear.value,currentMonth.value,1)
    console.log("new date : " + newDate);
    initCalendar(newDate);
}

function showPreviousMonth() {
  selectedDate.value = 0;
  console.log("Displaying Previous month ");
  console.log("Current Year  " +   currentYear.value + " Curent Month :" + currentMonth.value);
  if(currentMonth.value == 11){
    currentYear.value = currentYear.value-1;
    currentMonth.value = 11
  }
  var newMonth = currentMonth.value -2;
  var newDate = new Date(currentYear.value,newMonth,1)
  console.log("new date : " + newDate);
  initCalendar(newDate);
}

function addNewEvent() {
  console.log("adding new event to calender");
}

initPage();

module.exports = {
  days:days,
  hours:hours,
  minutes:minutes,
  clock: ["AM","PM"],
  currentDate:currentDate,
  currentDayInWeek:currentDayInWeek,
  totalDaysInMonth:totalDaysInMonth,
  validDays:validDays,
  onDateSelected:onDateSelected,
  selectedDate:selectedDate,
  showNextMonth:showNextMonth,
  showPreviousMonth:showPreviousMonth,
  addNewEvent:addNewEvent
};
