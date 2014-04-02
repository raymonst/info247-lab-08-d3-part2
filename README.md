#INFO 247 Lab 08: D3.js part 2

##Instructions

###Setup
1. Clone this repository to your computer.
2. Open "index.html" in your browser.
3. Open "script.js" in your text editor.

###Goals
In this lab, you are building on the D3 visualization we created last time. 

###More practice with D3
1. The dataset is now contained in a csv file and you are importing it using d3.csv().
2. As such, you will need to open the html file in a server, locally or remotely (recall the Highcharts exercise).
3. You have four tasks:
  * Re-organizing the data:
    * Use d3.nest() to arrange the imported data.
    * The new dataset is organized by test number (i.e. array #1 contains data on the first test, etc.).
    * Then connect this new dataset to the existing functions to draw the bar chart.
  * Adding an "average score" line:
    * Use d3.rollup() to create a new dataset for the average score (i.e. average for test 1 is 80, etc.).
    * Then draw a new line on the chart that represents the average score for each test.
  * Adding a grid:
    * Use d3.svg.axis() to add y-axis to the chart
  * Scaling the chart:
    * Use d3.scale.linear() to allow the chart to adjust to changes in vertical dimension.
    * Work on this part after you have everything else working.
4. You only need to edit the script--no need to edit the HTML or CSS.