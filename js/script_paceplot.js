
//HTML DOM items
const dataList = document.getElementById('data-list');
const canvas = document.getElementById('pace-plotter');
const minText = document.getElementById('pace-min');
const secText = document.getElementById('pace-sec');
const dateBox = document.getElementById('date');


//chart inits
canvas.width = 700;
canvas.height = 500;
let xGrid = 10;
let yGrid = 10;
let cellSize = 10;
let ctx = canvas.getContext('2d');

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
            entries.push(new Entry(jsonEntries[i].pace, jsonEntries[i].date));

        console.log(entries);
        createList();
    }
    drawGrids();
    drawAxis();
    drawChart();
}



// add new entry based on the form inputs
function addEntry() {
    //get the pace and date from input boxes
    let paceEntry = parsePace();
    let dateEntry = parseDate();

    //don't run entry if the input is wrong format
    if (paceEntry == null || dateEntry == null) {
        return;
    }


    let entry = new Entry(paceEntry, dateEntry);
    entries.push(entry);
    //delete later************************************************
    entries.push(new Entry('5:57', '2020-02-06'));
    entries.push(new Entry('5:22', '2021-01-01'));
    entries.push(new Entry('5:23', '2020-06-02'));
    console.log("min:"  + entry.getMin());
    console.log("sec:" + entry.getSec());
    sortEntries();

    //save to local storage
    localStorage['entries-local'] = JSON.stringify(entries);

    createList();

}

//check for correct pace input format and fix.
//return correct format or null
function parsePace() {
    let min = minText.value;         //stores value from weightbox textbox into var weight
    let sec = secText.value;

    if ((min === "" && sec === "") || isNaN(min) || isNaN(sec)) {

        // reveal the hidden alert message
        console.log("bad input");
        return null
    } else if ((sec < 0 || sec > 60) || (min < 0 || min > 10)) {
        // reveal the hidden alert message
        console.log("bad range");
        return null
    }

    if (min === "") { min = '00'; }
    if (sec === "") { sec = '00'; }

    return min + ":" + sec;
}
function parseDate() {
    let date = dateBox.value;
    let today = new Date();
    if (date == "") {
        date = today;
    }


    return "" + date;
}

//creates the list of entries under the chart
function createList() {
    //clear all items from list
    while (dataList.firstChild) dataList.removeChild(dataList.firstChild);

    //add all list items from array
    for (let i in entries) {
        li = document.createElement('li');
        // Add text node with input values
        li.appendChild(document.createTextNode(`${entries[i].pace}: ${entries[i].date}`));
        dataList.appendChild(li);
        // dataList.prependChild(li); need somethign liek this . this function doesnt exist
    }
}

// sorts the entries array by date
function sortEntries() {
    entries.sort((a, b) => (new Date(a.date).getTime() - new Date(b.date).getTime()));
    console.log(entries);
}


function resetAll() {
    entries = [];
    localStorage.clear();

    //remove all items from list
    while (dataList.firstChild) dataList.removeChild(dataList.firstChild);
}


//entry class for paces and dates
class Entry {
    constructor(pace, date) {
        this.pace = pace
        this.date = new Date(date)
        //this.date = new Date(date.split('-'));
    }

    // Get Birth Year
    getPace() {
        return this.pace;
    }
    // Get Birth Year
    getMin() {
        return this.pace.split(':')[0];
    }
    // Get Birth Year
    getSec() {
        return this.pace.split(':')[1];
    }
    // Get Birth Year
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

    // Get Full Entry
    getFullEntry() {
        return `${this.pace} ${this.date}`
    }
}

//Chart section**************************************************************

//depends on inputs
function getDateAxis() {
    let xMin = 0;
    let xMax = 0;
}

function drawAxis() {
    //initialize cursor to bottom left of chart
    var xPlot = 5;
    var yPlot = 40;

    var time = 0;

    //draw axis lines
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(blocks(5), blocks(5));
    ctx.lineTo(blocks(5), blocks(40));
    ctx.lineTo(blocks(80), blocks(40));

    //set cursor to bottom left of chart
    ctx.moveTo(blocks(5), blocks(40));

    //draw Pace axis labels
    for (let i = 1; i <= 10; i++) {
        ctx.strokeText(`${time}:00`, blocks(2), blocks(yPlot));
        yPlot -= 4;
        time += 1;
    }

    //set up date range parameters
    var xMax = new Date();
    var xMin = new Date();
    xMin.setMonth(xMin.getMonth() - 12);


    //date range interval using 12 labels
    let xInterval = (xMax - xMin) / 12;


    //draw date axis labels
    for (let i = 1; i <= 13; i++) {

        let shortDate = `${xMin.getFullYear()}/${xMin.getMonth() + 1}/${xMin.getDate()}`;

        ctx.strokeText(shortDate, blocks(xPlot), blocks(42));
        ctx.arc(blocks(xPlot), blocks(42), 2, 0, Math.PI * 2, true);
        //date label spacing
        xPlot += 5;

        //increment the date label
        xMin.setTime(xMin.getTime() + xInterval);

    }
    ctx.stroke();
}

function drawChart() {

    ctx.beginPath();
    ctx.strokeStyle = "black";

    //set cursor to bottom left corner of chart initially
    ctx.moveTo(blocks(5), blocks(40));

    var xMax = new Date();
    var xMin = new Date();
    xMin.setMonth(xMin.getMonth() - 12);

    //plot each entry if it is in the range
    for (let entry of entries) {
        //make and if statement to check if its in the range of xmin and xmax or ignore it********************
        // console.log(entry.pace + " " + entry.date);
        let shortDate = `${entry.date.getFullYear()}/${entry.date.getMonth() + 1}/${entry.date.getDate()}`;

        //calculate location of pace coordinate
        let m = 5;
        let s = 46;
        let paceLocation = (m * 4) + (s / 15);

        //calculate location of date coordinate
        //plan - we have 60 blocks of usable space, can get date in ms
        //range=xmax-min
        //value=date-xmin
        //value=value*60blocks
        let xRange = xMax.getTime() - xMin.getTime();
        console.log("Range " + xRange);
        let wee = (entry.date.getTime() - xMin.getTime());
        console.log("wee" + wee);
        console.log("date: " + entry.date + " xmin: " + xMin);
        dateLocation = ((wee / xRange) * 60) + 5;//add 5 for axis offset

        console.log(dateLocation);

        ctx.strokeText(m + ":" + s + " " + shortDate, blocks(dateLocation), blocks(40 - paceLocation - 1));
        ctx.lineTo(blocks(dateLocation), blocks(40 - paceLocation));
        ctx.arc(blocks(dateLocation), blocks(40 - paceLocation), 2, 0, Math.PI * 2, true);
    }
    ctx.stroke();
}

function blocks(count) {
    return count * 10;
}

//delete later
function drawGrids() {
    ctx.beginPath();
    while (xGrid < canvas.height) {
        ctx.moveTo(0, xGrid)
        ctx.lineTo(canvas.width, xGrid);
        xGrid += cellSize;
    }
    while (yGrid < canvas.width) {
        ctx.moveTo(yGrid, 0)
        ctx.lineTo(yGrid, canvas.height);
        yGrid += cellSize;
    }
    ctx.stroke();
    ctx.strokeStyle = 'gainsboro';
}



onCreate();