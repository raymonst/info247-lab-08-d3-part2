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

	var yScale = d3.scale.linear()
		.domain([0, 100])
		.range([0, (h-100)]);

	var yAxisScale = d3.scale.linear()
		.domain([0, 100])
		.range([(h-100), 0]);



  // ----------------------------------------------------------------------------------------------------------------
  // DATA

	d3.csv("_data/data.csv", function(data) {

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

  	// first, nest the data
    var tests = d3.nest()
	    .key(function(d) {
	      return d.test
	    })
	    .sortKeys(d3.ascending)
	    .entries(data);

	  // then, create an array for each test
	  var testData01 = tests[0].values;
	  var testData02 = tests[1].values;
	  var testData03 = tests[2].values;
	  var testData04 = tests[3].values;


/* 
  	// you can use the .rollup() method to tame your data
  	// we'll use it to create a new dataset that only contains "test" & "average score" (i.e. average for test 1 is 80, etc.)
    // http://leaena.com/2014/01/d3-js-rollups/ 
*/

	  // use the rollup function to create a new array that contains 4 objects with test#/average for the key/value pair
	  var averages = d3.nest()
	    .key(function(d) {
	      return d.test
	    })
	    .sortKeys(d3.ascending)
	    .rollup(function(d) {
	      return d3.mean(d, function(g) {
	        return g.score;
	      });
	    })
	    .entries(data);



	  // ----------------------------------------------------------------------------------------------------------------
	  // CHART 
	  	  
	  // draw the base line
	  viz.append("line")
	    .attr({
	    	"x1": 50,
	    	"x2": 750,
	    	"y1": yAxisScale(0) + padding,
	    	"y2": yAxisScale(0) + padding,
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
	       	return yAxisScale(0) + (1.35 * padding);
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

	  // first, set up the y-axis
	  var yAxis = d3.svg.axis()
	    .scale(yAxisScale)
	    .orient("left")
	    .ticks(5);
	  
	  // then draw it
	  viz.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + padding + ", 50)")
	    .call(yAxis);
	  
	  // and draw the grid lines
	  for (var i=0; i<5; i++) {
  	  viz.append("line")
  	   .attr({
  	     "x1": padding,
  	     "x2": w - padding,
  	     "y1": yAxisScale((i+1)*20) + 50,
  	     "y2": yAxisScale((i+1)*20) + 50,
  	     "class": "grid"
  	   });
	  };
	 


	  // draw the average score line
	  viz.selectAll(".average")
	    .data([averages[0]])
	    .enter()
	    .append("line")
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



	  // draw the bars
    viz.selectAll("rect")
	    .data(testData01)
	    .enter()
	    .append("rect")
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

