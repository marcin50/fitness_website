/*
This code was heavily modified to meet the needs and styling of the website.

Code source and attribution:
Source: https://codepen.io/mmurphydev/pen/rdeKVz
Author: Matt Murphy
This code is from codepen.io. It is open-source software.

Copyright (c) 2021 by Matt Murphy (https://codepen.io/mmurphydev/pen/rdeKVz)
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// creates a function to do a 1rep max calculation
//this section was heavily modified to meet the needs and styling of the website
function calculateMax() {
    //store the result and alert elements into constants for easy access
    const msg = document.getElementById('alert-msg');
    const result = document.getElementById('result');
    //global variables for calculation of 1 rep max
    var max = 0;
    var weight = document.getElementById("weightBox").value;         //stores value from weightbox textbox into var weight
    var reps = document.getElementById("repBox").value;              //stores value from repbox textbox into var reps
        //convertes string variables into floating point to perform caculation and stores into number variable: max
        max = parseFloat((weight * reps) * .0333) + parseFloat(weight);
    /*check if there is input missing and prompts the user to enter values
    the original code was modified as to not use an alert box.
    Instead a timed message label is displayed.
    Also, check if user entered a number
    */
    if (weight === "" || reps === "" || isNaN(max)) {
        // reveal the hidden alert message
        msg.style.display = 'block';
        //hide 1 rep max msg from previous calculation
        result.style.display = 'none';
        // Hide the message after 3seconds
        setTimeout(() => msg.style.display = 'none', 3000);

    } else {

        //displays the calculation result in the result label using the DOM
        //reveal the 1 rep max message
        result.innerHTML = "Your estimated One Rep Max is " + Math.floor(max) + " lbs";
        result.style.display = 'block';
        //reset variables for next calculation
        weight = "";
        reps = "";
    }
}
