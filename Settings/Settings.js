var Observable = require("FuseJS/Observable");

var settings = ["Background Image","Passcode","Quotes","Humour Color","License","Tutorial","Contributors","About"];

var currentPageTitle = Observable();
// console.log(settings[1]);

module.exports =  {	
	settings: [                
                { setting: "Background Image" },
                { setting : "Passcode" },
                {setting : "Quotes" },               
                {setting : "Humour Color" },
                {setting : "License" },
                {setting : "Tutorial" },
                {setting : "Contributors" },
                {setting : "About" }
            ],
    currentPageTitle :"Settings"
};