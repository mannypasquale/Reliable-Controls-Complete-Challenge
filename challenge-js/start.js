"use strict";
let fs = require('fs');

class LogParser {
    constructor() {
        this.dict = {};
    }

    //function to return how many of the fault sequences were recorded for 
    // a given deviceID
    getEventCount(deviceID) {
        if (!deviceID) {
            throw "DeviceID is null";
        }
        if (this.dict.hasOwnProperty(deviceID)) {
            return this.dict[deviceID];
        }
        return "Device ID Not in EventLog";
    }

    // manipulate strings to parse string to new date object
    _getTimeDiff(prevTime, currTime) {
        let prevLineDate, currLineDate, timeDiff;
        prevLineDate = prevTime.slice(0, 10) + 'T' + prevTime.slice(11);
        currLineDate = currTime.slice(0, 10) + 'T' + currTime.slice(11);
        prevLineDate = new Date(prevLineDate);
        currLineDate = new Date(currLineDate);
        timeDiff = (currLineDate.getTime() - prevLineDate.getTime()) / 1000;
        timeDiff /= 60;
        timeDiff = Math.abs(Math.round(timeDiff));
        return timeDiff;
    }

    parseEvents(devID, eventLog) {

        //error handling at the beginning
        if (typeof devID !== "string") {
            throw "DEV ID HAS TO BE A STRING";
        }
        if (!devID) {
            throw "devID cant be null";
        }
        if (!eventLog) {
            throw "event Log cant be null";;
        }


        let fileData;
        //try to open and read file and if unsuccessful log event
        try {
            fileData = fs.readFileSync(`./${eventLog}`);
            fileData = fileData.toString();
        } catch (error) {
            console.log("NOT A FILE");
        }
        if (!fileData) {
            throw "File data is Empty";
        }

        fileData = fileData.split("\n");
        let first = true, previousLine, currentLine, prevLineDate, currLineDate, timeDiff, event = false;

        for (let i = 0, j = 1; j < fileData.length; i++ , j++) {
            //check for condition increment
            // rinse repeat

            //check first line and make sure its the line
            // with timestamp and value
            if (first === true) {
                if (!(fileData[0].includes("Timestamp") && fileData[0].includes("Value"))) {
                    throw "EventLog Does not have Timestamp and Value as first Line in textfile";
                }
                previousLine = fileData[j];
                first = false;
                continue;
            }
            previousLine = fileData[i].split("\t");
            currentLine = fileData[j].split("\t");

            //check if the value is back to back 3
            // Begin checking for "fault" sequence
            // start with the first condition and if true
            // check if its been in that sequence for >= 5 mins and if so
            // set triggerEvent to true and grab next two lines
            if (previousLine[1] === '3' && currentLine[1] === '3') {

                //grab time diff and see if >= 5 mins
                timeDiff = this._getTimeDiff(previousLine[0], currentLine[0]);
                if (timeDiff >= 5) {
                    event = true;
                    continue;
                }
                timeDiff = 0;
                event = false;
                continue;

            }
            //checks if sequence cycles between stage 3 and 2
            if (previousLine[1] === '3' && currentLine[1] === '2' && event === true) {
                continue;
            }
            if (previousLine[1] === '2' && currentLine[1] === '3' && event === true) {
                continue;
            }
            // if we trigger all events then add/update entry to the log
            if (currentLine[1] === '0' && event === true) {
                if (!this.dict) {
                    this.dict[devID] = 1;
                    event = false;
                    continue;
                }
                if (this.dict.hasOwnProperty(devID)) {
                    this.dict[devID]++;
                    event = false;
                    continue;
                }
                this.dict[devID] = 1;
                event = false;
                continue;
            } else {
                event = false;
            }
        }
    }
}




/* 
	do unit tests to make sure implmentations works
*/
const logParser = new LogParser();


//pass it an empty file and should catch throw an error
try {
    logParser.parseEvents('mytest', 'text.csv');

} catch (error) {
    console.log(error);
}

// pass non string as deviceID
// should catch thrown error
try {
    logParser.parseEvents(123, 'text.csv');

} catch (error) {
    console.log(error);
}


// device id K should have 13 events
logParser.parseEvents('k', 'text2.csv');
logParser.parseEvents('k', 'text3.csv');
logParser.parseEvents('k', 'text4.csv');
let count = logParser.getEventCount("k");
if (count === 13) {
    console.log("The event Count matches");
}

//device id lol should have 1 event
logParser.parseEvents('lol', 'text2.csv');
count = logParser.getEventCount('lol');
if (count === 1) {
    console.log("The event count matches")
}







