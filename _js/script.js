$(document).ready(function() {

  // ----------------------------------------------------------------------------------------------------------------
  // INITIAL SETUP

	var w = 800;
	var h = 500;
	var padding = 50;
	var viz = d3.select("#viz");
	viz.attr("width", w).attr("height", h);



  // ----------------------------------------------------------------------------------------------------------------
  // SCALE

/*
	// basic example of scaling
	var scale = d3.scale.linear()
		.domain([0, 100])
		.range([0, 500]);

  // so if the input (domain) is 75, the output (range) will be 375
	// you can also set the scaling so it corresponds to the maximum value of the data observed
	// this doesn't make sense in our example, since the range is clearly defined from 0 to 100 (the range of test scores)
	// if we're dealing with a country's population growth, for example, there isn't necessarily a "ceiling"; as such, we may want to take the maximum value into consideration so the chart will be automatically adjusted
	// the scaling code may look something like this:
	var scale = d3.scale.linear()
		.domain([0, d3.max(dataset, function(d) {return d.population})])
		.range([0, 500]);
*/

  // TASK
  // create 2 variables, "yScale" and "yAxisScale"
  // yScale controls the scaling for size/height
  // yAxisScale controls the scaling for y-coordinates



  // ----------------------------------------------------------------------------------------------------------------
  // DATA

	d3.csv("_data/data.csv", function(data) {

  	// take a look at what is being imported from the csv file
  	console.log(data);

/*
  	// basic example of nesting
  	var newData = d3.nest()
      .key(function(d) {
        return d.department;
      })
      .entries(csvInput);

    // d3.nest() turns a flat array of objects ("csvInput") into an array of arrays ("newData")
    // in this example, we are grouping the new dataset by department ("d.department")
  	// http://www.jeromecukier.net/blog/2012/05/28/manipulating-data-like-a-boss-with-d3/
*/

    // TASK
  	// first, nest the data, arranged by test #, and assign this to a new variable "tests"
  	var tests;

    // TASK
	  // then, create 4 variables from "tests", each containing data for each test
	  var testData01;
	  var testData02;
	  var testData03;
	  var testData04;



/* 
  	// you can use the .rollup() method to tame your data
  	// we'll use it to create a new dataset that only contains "test" & "average score" (i.e. average for test 1 is 80, etc.)
    // http://leaena.com/2014/01/d3-js-rollups/ 
*/

    // TASK
	  // use the rollup function to create a new array that contains 4 objects with test#/average for the key/value pair
	  // assign this to a new variable "averages"
	  var averages;



	  // ----------------------------------------------------------------------------------------------------------------
	  // CHART 
	  	  
	  // draw the base line
	  viz.append("line")
	    .attr({
	    	"x1": 50,
	    	"x2": 750,
	    	"y1": 450,
	    	"y2": 450,
	    	"stroke-width": 1,
	    	"stroke": "#ccc"
	   });
	  
	   // draw the names
	   viz.selectAll("text.name")
	     .data(testData01)
	     .enter()
	     .append("text")
	     .text(function(d, i) {
	         return d.name;
	     })
	     .attr({
	     	"x": function(d, i) {
	     	  return (i * 70) + 90;
	     	},
	     	"y": function(d,i) {
	       	// TASK
	       	// once you get everything else working, change the static value to scaled
  	     	return 475;
	     	},
	     	"text-anchor": "middle"
	     });



/* 
  	// basic example of axis
  	var xAxis = d3.svg.axis()
  	  .orient("bottom")
	    .ticks(5);
	  viz.append("g")
	    .call(xAxis);

	  // http://alignedleft.com/tutorials/d3/axes
*/

    // TASK
	  // first, set up the y-axis
	  var yAxis;
	  
    // TASK
	  // then draw it
	  
    // TASK
	  // and draw the grid lines
	  /* modify the attributes accordingly:
	  - "x1"
	  - "x2"
	  - "y1"
	  - "y2"
	  - "class": "grid"
	  */
	  for (var i=0; i<5; i++) {
  	  viz.append("line")
  	   .attr({
  	   });
	  };
	 


    // TASK
	  // draw the average score line
	  // the data should come from the "averages" variable
	  /* modify the attributes accordingly:
	  - "x1"
	  - "x2"
	  - "y1"
	  - "y2"
	  - "class": "average"
	  */
	  viz.selectAll(".average")
	    .data()
	    .enter()
	    .append("line")
	    .attr({
	    });



	  // draw the bars
    viz.selectAll("rect")
	    .data(testData01)
	    .enter()
	    .append("rect")
	    .attr({
	    	"width": 40,
	    	"height": function(d, i) {
	       	// TASK
	       	// once you get everything else working, change the static value to scaled
			    return d.score;
	    	},
	    	"x": function(d, i) {
	    	  return (i * 70) + 70;
	    	},
	    	"y": function(d, i) {
	       	// TASK
	       	// once you get everything else working, change the static value to scaled
			    return d.score + padding;
	    	},
	    	"class": function(d, i) {
	    	  if (d.score < 60) {
	    	    return "fail";
	    	  }
	    	},
	    	"desc": function(d, i) {
	    		return d.score;
	    	}
	  });



	  // ----------------------------------------------------------------------------------------------------------------
	  // INTERACTIONS

	  // call the interactions() function
	  interactions();

  	// link the click functions to the datasets
  	$("#test-01").on("click", function() {
  		updateData(viz, testData01, [averages[0]]);
  		return false;
  	});	
  	
  	$("#test-02").on("click", function() {
  		updateData(viz, testData02, [averages[1]]);
  		return false;
  	});	
  	
  	$("#test-03").on("click", function() {
  		updateData(viz, testData03, [averages[2]]);
  		return false;
  	});	
  	
  	$("#test-04").on("click", function() {
  		updateData(viz, testData04, [averages[3]]);
  		return false;
  	});		

  });



  // ----------------------------------------------------------------------------------------------------------------
  // INTERACTIONS (FUNCTIONS)

  function interactions() {

  	// hover event interaction
  	$("#viz rect").on("mouseenter", function() {
  		var self = $(this);
  		// fade out slightly
  		self.animate({"opacity":.8}, 100);
  		// change the position of the "score-popup" div, its content (to reflect the score), then show it
  		$("#score-popup")
  			.css({
  				"left": parseInt(self.position().left) + parseInt(self.attr("width")) - 55,
  				"top": self.position().top - 40
  			})
  			.text(self.attr("desc"))
  			.stop(true,true)
  			.fadeIn(50);
  	}).on("mouseleave", function() {
  		var self = $(this);
  		// fade the bar back in
  		self.animate({"opacity":1}, 100);
  		// fade out the score
  		$("#score-popup").stop(true,true).fadeOut(50);
  	});
  
   	// trigger the "active" state
  	$(".update-data").on("click", function() {
  		$(".update-data").removeClass("selected");
  		$(this).addClass("selected");
  	});

  }



 	// create a function that controls the transition
  function updateData(target, allScores, avgScores) {
    
    // for bar chart
    target.selectAll("rect")
      .data(allScores)
      .transition()
      .duration(500)
      .attr({
      	"width": 40,
      	"height": function(d, i) {
			    return yScale(d.score);
      	},
      	"x": function(d, i) {
        	return (i * 70) + 70;
      	},
      	"y": function(d, i) {
			    return yAxisScale(d.score) + padding;
      	},
      	"class": function(d, i) {
        	if (d.score < 60) {
      	    return "fail";
      	  }
      	},
      	"desc": function(d, i) {
      		return d.score;
      	}
      });

    // for average score line
	  viz.selectAll(".average")
	    .data(avgScores)
      .transition()
      .duration(500)
	    .attr({
  	    "class": "average",
	    	"x1": 50,
	    	"x2": 750,
	    	"y1": function(d, i) {
			    return yAxisScale(d.values) + padding;
	    	},
	    	"y2": function(d, i) {
			    return yAxisScale(d.values) + padding;
	    	}
	    });

  };



});

