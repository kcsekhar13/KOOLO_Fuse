var Observable = require("FuseJS/Observable");
var Storage = require('FuseJS/Storage');
var osCalander = require('Calender');

var selectedDate = Observable();
var selectedMonth = Observable();
var currentYear = Observable();
var currentMonth = Observable();
var currentDate = Observable();
var todayDate = Observable();
var currentDayInWeek = Observable();
var totalDaysInMonth = Observable();
var validDays = Observable();
var myEvents = [];
var observableEvents = Observable();
var eventsFile = "events.json";
var todayEvents = Observable();
var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

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

function myEvent(dateString,date,month,time,color,title,description,isRemainderSet){
  var self = this;
  this.dateString = dateString;
  this.date = date;
  this.month = month;
  this.time=time;
  this.eventColor = color;
  this.Title = title;
  this.Description = description;
  this.isRemind = isRemainderSet;
}

function initPage() {
  validDays = Observable();
  initCalendar(new Date());
  readKooloEvents ();
}

function initCalendar(date) {
  validDays.clear();
  // console.log( "Updating calender to new date" +JSON.stringify(date, undefined, '    '));
  var d = new Date(date);
  todayDate.value = d.getDate();
  currentYear.value = d.getFullYear();
  currentDate.value = d.toDateString().substring(4,7) + "-" + d.getFullYear();
  currentMonth.value = d.getMonth()+1;

  currentDayInWeek.value= new Date(currentYear.value,d.getMonth(),1).getDay();
  totalDaysInMonth.value = daysInMonth(currentMonth.value,currentYear.value);

  for (var i = 0; i < currentDayInWeek.value; i++) {
    validDays.add(new myDay('',false) );
  }
  for (var i = 1; i <= totalDaysInMonth.value; i++) {
    validDays.add(new myDay(i,false));
  }
  // console.log("Year  " +   currentYear.value + " Month :" + currentMonth.value);
  // console.log("Total days in current month " + totalDaysInMonth.value);
  // console.log("validDays count " +validDays.length );
}

function onDateSelected(date) {
  selectedDate.value = date.data.date;
  reloadEvents();
}

function reloadEvents() {
  todayEvents.value = myEvents.filter(function(e){
    return e.dateString === getRepeatEventDate().toDateString();;
  });
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
    initCalendar(newDate);
    reloadEvents();
}

function showPreviousMonth() {
  selectedDate.value = 0;
  console.log("Displaying Previous month ");
  if(currentMonth.value == 11){
    currentYear.value = currentYear.value-1;
    currentMonth.value = 11
  }
  var newMonth = currentMonth.value -2;
  var newDate = new Date(currentYear.value,newMonth,1)
  initCalendar(newDate);
  reloadEvents();
}

var eventTitle = Observable();
var eventDescription = Observable();
var repeatOnDays= [];

function onRepeatEventDaySelected(arg) {
  console.log(JSON.stringify(arg.data));
  if(repeatOnDays.indexOf(days.indexOf(arg.data))==-1) {
      repeatOnDays.push(days.indexOf(arg.data));
  }
  else {
    var index = repeatOnDays.indexOf(days.indexOf(arg.data))
    console.log(index);
    repeatOnDays.splice(index,1);
  }
    console.log(JSON.stringify(repeatOnDays));
}

function addNewEvent() {
  console.log("adding new event to calender");
  if(repeatOnDays.length == 0){
      var date = getRepeatEventDate();
      myEvents.unshift(new myEvent(date.toDateString(),todayDate.value,currentMonth.value,eventTimeSliderValue.value,
          dateColor.color.value,eventTitle.value,eventDescription.value,true));
        osCalander.AddEvent(date);  
  }
  else{
        for (var i = 0; i < repeatOnDays.length; i++) {
         var tempDay = getRepeatEventDate();
          console.log("******* Adding Repeated Event ************** from "  + tempDay);
          var newDate = getSixthMonthDate(tempDay);
          for (var d = tempDay ; d <= newDate; d.setDate(d.getDate() + 1)){
              if(d.getDay() == repeatOnDays[i]){
                myEvents.unshift(new myEvent(d.toDateString(),todayDate.value,currentMonth.value,
                                            eventTimeSliderValue.value, dateColor.color.value,eventTitle.value,eventDescription.value,true));
              }
          }
        }
  }
  repeatOnDays = [];
  updateEvents();
  reloadEvents();
}

function getRepeatEventDate() {
  var day = new Date(currentYear.value,(currentMonth.value-1),todayDate.value);
  if(selectedDate.value != undefined){
    day = new Date(currentYear.value,(currentMonth.value-1), selectedDate.value);
  }
  return day;
}

function getSixthMonthDate(date) {
  var result = new Date(date);
  result.setDate(result.getDate() + 180);
  return result
}

function updateEvents() {
  observableEvents.value = myEvents;
  Storage.write(eventsFile, JSON.stringify(myEvents, undefined, '    ')).then(function(success) {
       console.log("Save " + eventsFile +  (success ? " success" : "failure"));
       readKooloEvents();
  },function (error) {
     console.log("Error in writing events to file");
  });
}

function readKooloEvents() {
  Storage.read(eventsFile).then(function(content) {
        myEvents = JSON.parse(content);
        observableEvents.value = myEvents;
        todayEvents.value = myEvents.filter(function(e){
          return e.dateString === new Date().toDateString();;
        });
        // console.log("Printing today Events " + JSON.stringify(todayEvents.value));
  }, function(error) {
      console.log("failed to read koolo events file");
  });
}

var timeHourSliderValue = Observable(0);
var timeMinuteSliderValue = Observable(0);
var eventTimeSliderValue  = Observable("00:00");

timeHourSliderValue.addSubscriber(function(val) {
  eventTimeSliderValue.value = getHourvalue(val.value.toString()) + ":"+getMinutevalue(timeMinuteSliderValue.value.toString());
});

function getHourvalue(arg) {
  if(arg == "0")
  return "00";
  if(arg == "23")
  return "23";
  var hour = arg;
  if(hour.split('.').length == 0){
      return hour.length > 1 ? hour : "0"+hour;
  }
  if(hour.split('.').length > 1){
    return hour.split('.')[0].length > 1 ? hour.split('.')[0] : "0"+hour.split('.')[0];
  }
}

function getMinutevalue(arg) {
  if(arg == "0")
  return "00";
  if(arg == "59")
  return "59";
  var minute = arg;
  if(minute.split('.').length == 0){
      return minute.length > 1 ? minute : "0"+minute;
  }
  if(minute.split('.').length > 1){
    return minute.split('.')[0].length > 1 ? minute.split('.')[0] : "0"+minute.split('.')[0];
  }
}

timeMinuteSliderValue.addSubscriber(function(val) {
  eventTimeSliderValue.value = getHourvalue(timeHourSliderValue.value.toString()) + ":"+ getMinutevalue(val.value.toString());
});

var dateColor = {
    date: Observable(new Date().getDate()),
    dateString: currentMonth.map(function () {
      return ((currentMonth.value).length > 1 ?(currentMonth.value) : "0"+(currentMonth.value))  + ", " + currentYear.value;
    }),
    color: Observable()
};

function updateEventDateColor(context) {
    dateColor.color.value = context.data.code;
}

function InitNewEventDate() {
    if(selectedDate.value != undefined){
      dateColor.date.value = selectedDate.value;
    }
}

initPage();

module.exports = {
  days:days,
  currentDate:currentDate,
  currentDayInWeek:currentDayInWeek,
  totalDaysInMonth:totalDaysInMonth,
  validDays:validDays,
  onDateSelected:onDateSelected,
  dateColor:dateColor,
  updateEventDateColor: updateEventDateColor,
  selectedDate:selectedDate,
  showNextMonth:showNextMonth,
  showPreviousMonth:showPreviousMonth,
  addNewEvent:addNewEvent,
  eventTitle:eventTitle,
  eventDescription:eventDescription,
  timeHourSliderValue :timeHourSliderValue,
  timeMinuteSliderValue:timeMinuteSliderValue,
  eventTimeSliderValue:eventTimeSliderValue,
  onRepeatEventDaySelected:onRepeatEventDaySelected,
  InitNewEventDate:InitNewEventDate,
  todayEvents:todayEvents
};
