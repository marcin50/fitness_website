//Author: Marcin Lenart
//HTML DOM items
const dataList = document.getElementById('data-list');
const canvas = document.getElementById('pace-plotter');
const minText = document.getElementById('pace-min');
const secText = document.getElementById('pace-sec');
const dateBox = document.getElementById('date');
const alertMsg = document.getElementById('alert-msg2');
const dateBoxMin = document.getElementById('date-min');
const dateBoxMax = document.getElementById('date-max');


//chart canvas inits
canvas.width = 700;
canvas.height = 440;
let xGrid = 10;
let yGrid = 10;
let cellSize = 10;
let ctx = canvas.getContext('2d');

//main data variable
var entries = [];

//run on page load
//-load entries from local storage 
//-create list, and chart
function onCreate() {
    //check if there is anything in local storage and load it
    if (localStorage.length > 0) {
        let jsonEntries = JSON.parse(localStorage['entries-local']);

        //transfer local storage to entries array
        for (let i in jsonEntries)
            entries.push(new Entry(jsonEntries[i].pace, (jsonEntries[i].date), false));

        createList();
    }
    //creates chart with defautl range 
    drawDefaultChart();
}

// add new entry from the pace and date inputs when button is pressed
function addEntry() {
    //get the pace and date from input boxes
    let paceEntry = parsePace();
    let dateEntry = parseDate();

    //don't add entry if the input is wrong format, exits the function
    if (paceEntry == null || dateEntry == null) { return; }

    //create new entry object and push to data array
    let entry = new Entry(paceEntry, dateEntry, true);
    entries.push(entry);

    //sorts entries array by date
    sortEntries();

    //save to local storage
    localStorage['entries-local'] = JSON.stringify(entries);

    //refresh the list
    createList();
    //reset and then draw chart
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear existing canvas
    drawAxis();
    drawChart();
}

//generates a random test entry within 1 year and max 10min
function addTestEntry() {
    //random variable generation section
    let min = Math.floor(Math.random() * 9);
    let sec = Math.floor(Math.random() * 60);
    let paceEntry = min + ":" + sec;

    let dateEntry = new Date();
    dateEntry.setDate(dateEntry.getDate() - Math.floor(Math.random() * 364) + 1);
    //same as in addEntry function
    // entries.push(new Entry('5:57', '2020-02-09', true));
    let entry = new Entry(paceEntry, dateEntry, false);
    entries.push(entry);
    //sorts entries array by date
    sortEntries();
    //save to local storage
    localStorage['entries-local'] = JSON.stringify(entries);
    createList();
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear existing canvas
    drawAxis();
    drawChart();
}

//check for correct pace input format and fix.
//return correct format or null
function parsePace() {
    let min = minText.value;
    let sec = secText.value;

    //check if boxes are empty or not a number. display alert box if bad input
    if ((min === "" && sec === "") || isNaN(min) || isNaN(sec)) {
        // reveal the hidden alert message
        console.log("missing input");
        alertMsg.style.display = 'block';
        // Hide the message after a few seconds
        setTimeout(() => alertMsg.style.display = 'none', 2500);
        return null

    } else if ((sec < 0 || sec > 60) || (min < 0 || min > 10)) {
        // reveal the hidden alert message if range is bad
        console.log("bad pace range");
        alertMsg.style.display = 'block';
        // Hide the message after a few seconds
        setTimeout(() => alertMsg.style.display = 'none', 2500);
        return null
    }
    //if only one or the other is missing fill the other with zeroes
    if (min === "") { min = '00'; }
    if (sec === "") { sec = '00'; }

    return min + ":" + sec;
}

//check for correct date input format and fix and return date
function parseDate() {
    let date = dateBox.value;
    let today = new Date();
    //use today's date if left empty
    if (date == "") {
        date = today;
    }
    return "" + date;
}

//creates the list of entries under the chart
function createList() {
    //clear all items from list
    while (dataList.firstChild) dataList.removeChild(dataList.firstChild);

    //add all list items from entries array
    for (let i in entries) {
        li = document.createElement('li');
        // Add text node with input values
        li.appendChild(document.createTextNode(`${entries[i].pace} on ${entries[i].date.toDateString()}`));
        dataList.appendChild(li);
    }
}

// sorts the entries array by date
function sortEntries() {
    entries.sort((a, b) => (new Date(a.date).getTime() - new Date(b.date).getTime()));
}

//resizes the range of the chart
function resizeRange() {
    //check that the min date is not greater than the max date
    if (dateBoxMax.value <= dateBoxMin.value) {
        alertMsg.style.display = 'block';
        console.log("bad date resize range");
        // Hide the message after a few seconds
        setTimeout(() => alertMsg.style.display = 'none', 2500);
    }
    else {
        xMax = new Date(dateBoxMax.value.replace(/-/g, '/'));
        xMin = new Date(dateBoxMin.value.replace(/-/g, '/'));
        ctx.clearRect(0, 0, canvas.width, canvas.height); //clear existing canvas
        drawAxis();
        drawChart();
    }
}

//draw the default chart with default range
function drawDefaultChart() {
    //reset to default axis of 1 year range
    xMax = new Date();
    xMin = new Date();
    xMin.setMonth(xMin.getMonth() - 12);

    //clear canvas and draw chart
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear existing canvas
    drawAxis();
    drawChart();
}


//resets all of the entries, chart, list and storage
function resetAll() {
    //reset date
    entries = [];
    localStorage.clear();

    //clear most of the chart
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxis();

    //remove all items from list
    while (dataList.firstChild) dataList.removeChild(dataList.firstChild);
}


//entry class for paces and dates
class Entry {
    constructor(pace, date, format) {
        this.pace = pace;
        //fixes the date timezone depending on the input style
        if (format) {
            this.date = new Date(date.replace(/-/g, '/'));
        } else this.date = new Date(date);

    }
    getPace() {
        return this.pace;
    }
    getMin() {

        return parseInt(this.pace.split(':')[0]);
    }
    getSec() {
        return parseInt(this.pace.split(':')[1]);
    }
    getYear() {
        return this.date.getFullYear
    }
    getMonth() {
        return this.date.getMonth
    }
    getDay() {
        return this.date.getDate
    }

    getDate() {
        return this.date.getDate
    }
    getFullEntry() {
        return `${this.pace} ${this.date}`
    }
}
//##########################################################################
//Chart section
//##########################################################################
function drawAxis() {
    //initialize cursor to bottom left of chart
    //bottom left of chart is: (blocks(5), blocks(40)) in terms of x,y plane
    var xPlot = 5;
    var yPlot = 40;
    var time = 0;

    //draw axis lines
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(blocks(5), blocks(2));
    ctx.lineTo(blocks(5), blocks(40));
    ctx.lineTo(blocks(80), blocks(40));

    //Pace axis (Y-axis)
    for (let i = 1; i <= 10; i++) {
        //draw ticks
        ctx.moveTo(blocks(4), blocks(yPlot));
        ctx.lineTo(blocks(6), blocks(yPlot));

        //draw pace label
        ctx.strokeText(`${time}:00`, blocks(1.75), blocks(yPlot));
        //increment
        yPlot -= 4;
        time += 1;
    }
    //moving x position
    let xPos = new Date(xMin);
    //date range interval using 12 labels
    let xInterval = (xMax - xMin) / 12;

    //reduce font for date labels so they fit
    ctx.font = "9px sans-serif";

    //date axis (X-axis)
    for (let i = 1; i <= 13; i++) {
        //draw ticks
        ctx.moveTo(blocks(xPlot), blocks(41));
        ctx.lineTo(blocks(xPlot), blocks(39));

        //draw date label
        let shortDate = `${xPos.getFullYear()}/${xPos.getMonth() + 1}/${xPos.getDate()}`;
        ctx.strokeText(shortDate, blocks(xPlot - 1), blocks(42));

        //date label spacing
        xPlot += 5;

        //increment the date label
        xPos.setTime(xPos.getTime() + xInterval);

    }
    //reduce font for date labels so they fit
    ctx.font = "12px sans-serif";
    ctx.stroke();

}

//draws the chart data points and line connection for each entry that fits in the range
function drawChart() {
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    var firstElement = true;
    ctx.font = "10px sans-serif";
    //plot each entry if it is in the range
    for (let entry of entries) {
        //check if entry is in the range of xmin and xmax, otherwise ignore it
        if (entry.date > xMin && entry.date < xMax) {
            //calculate location of pace coordinate
            let m = entry.getMin();
            let s = entry.getSec();
            let paceLocation = (m * 4) + (s / 15);

            //calculate location of date coordinate
            //plan - we have 60 blocks of usable space, can get date in ms with getTime()
            //range=xmax-min
            //value=date-xmin
            //value=value*60blocks
            let xRange = xMax.getTime() - xMin.getTime();
            let dateLocation = (entry.date.getTime() - xMin.getTime());
            dateLocation = ((dateLocation / xRange) * 60) + 5;//add 5 for axis offset
            ctx.strokeText(m + ":" + s + " ", blocks(dateLocation), blocks(40 - paceLocation - 1));
            
            //start at this first element
            if (firstElement) { ctx.moveTo(blocks(dateLocation), blocks(40 - paceLocation)); }

            //connect remaining data points
            ctx.lineTo(blocks(dateLocation), blocks(40 - paceLocation));
            ctx.arc(blocks(dateLocation), blocks(40 - paceLocation), 2, 0, Math.PI * 2, true);
            firstElement = false;
        }
    }
    ctx.font = "12px sans-serif";
    ctx.stroke();
}

//used to scale up the canvas to a grid of 10x10 pixels
function blocks(count) {
    return count * 10;
}
//initial chart on page load
onCreate();