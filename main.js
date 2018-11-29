// Your browser will call the onload() function when the document
// has finished loading. In this case, onload() points to the
// start() method we defined below. Because of something called
// function hoisting, the start() method is callable on line 6
// even though it is defined on line 8.
window.onload = start;

// This is where all of our javascript code resides. This method
// is called by "window" when the document (everything you see on
// the screen) has finished loading.
var filterSwitchedOff = "select-profit"
var width = 1350;
var height = 700;
function start() {
    // Select the graph from the HTML page and save
    // a reference to it for later.
    var graph = document.getElementById('graph');

    // Specify the width and height of our graph
    // as variables so we can use them later.
    // Remember, hardcoding sucks! :)

    // Here we tell D3 to select the graph that we defined above.
    // Then, we add an <svg></svg> tag inside the graph.
    // On the <svg> element, we set the width and height.
    // Then, we save the reference to this element in the "svg" variable,
    // so we can use it later.
    //
    // So our code now looks like this in the browser:
    // <svg width="700" height="600">
    // </svg>
    var svg = d3.select(graph)
        .append('svg')
        .attr('width', width + 40)
        .attr('height', height + 50);

    // Remember, "svg" now references to <svg width="700" height="600"></svg>
    // So now we append a group <g></g> tag to our svg element, and return a
    // reference to that and save it in the "bars" variable.
    //
    // Now bars looks like this:
    // <g></g>
    //
    // And the svg element in our browser looks like this:
    // <svg width="700" height="600">
    //  <g></g>
    // </svg>
    var dots = svg.append('g');


    // Our bar chart is going to encode the profit along different topics
    // This means that the length of the x axis depends on the number of categories.
    // The y axis should cover the range of profits/losses of the data.
    var xScale = d3.scaleBand().rangeRound([45, width - 10]);
    var yScale = d3.scaleLinear().range([10, height - 10]);
    var rScale = d3.scaleLinear().range([5, 25]);


    svg.on('click', function() {
        dots.selectAll('.dot')
            .transition() //does bar change transition
            .duration(function(d) {
                return Math.random() * 1000;
            })
            .delay(function(d) {
                return d.frequency * 8000
            })
    })

    // D3 will grab all the data from "data.csv" and make it available
    // to us in a callback function. It follows the form:
    //
    // d3.csv('file_name.csv', accumulator, callback)
    //
    // Where 'file_name.csv' - the name of the file to read
    // accumulator - a method with parameter d that lets you pre-process
    //               each row in the CSV. This affects the array of
    //               rows in the function named 'callback'
    //
    // callback - a method with parameters error, data. Error contains
    //            an error message if the data could not be found, or
    //            was malformed. The 'data' parameter is an array of
    //            rows returned after being processed by the accumulator.
    d3.csv('movies.csv', function(d) {
        d.budget = +d.budget;
        d.gross = +d.gross;
        d.movie_facebook_likes = +d.movie_facebook_likes;
        d.genres = d.genres.split("|")[0];
        return d;
    }, function(error, data) {

        var comparatorFunc = function(g1, g2) {
            if (g1 == g2) {return true;}
            else {return false;}
        }
        var genreData =data.map(function(d) {
            return d.genres;
        });
        var genres = [];

        for (i=0;i < genreData.length;i++) {
            var exists = false;
            var curr = genreData[i];

            for (j=0;j<genres.length;j++) {
                if (comparatorFunc(genres[j][0], curr)) {
                    genres[j][1]++;
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                genres.push([curr, 1]);
            }
        }

        var lowGenres = [];
        for(i=0;i<genres.length;i++) {
            if (genres[i][1] < 4) {
                lowGenres.push(genres[i][0]);
            }
        }

        data.filter(function(d) {
            for (i=0;i<lowGenres.length;i++) {
                if (lowGenres[i] == d.genres) {
                    return true;
                }
            }
            return false
        })

        // for (i=0; i <genreData.length;i++) {
        //     if (lowGenres.includes(genreData[i])) {

        //     }
        // }

        xScale.domain(data.filter(function(d) {
            for (i=0;i<lowGenres.length;i++) {
                if (lowGenres[i] == d.genres) {
                    return false;
                }
            }
            return true;
        }).map(function(d) {
            return d.genres;
        }));


        yScale.domain([d3.max(data, function(e) {
            return e.gross - e.budget;
        }) + 20000000, -200000000]);

        rScale.domain([0, d3.max(data, function(d) {
            return d.movie_facebook_likes;
        })]);

        dots.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(60, 0)')
            .call(d3.axisLeft(yScale).ticks(height/20).tickFormat(d3.format(".2s")));

        dots.append("g")
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,'+ (height) + ' )')
            .call(d3.axisBottom(xScale));

        // Create the bars in the graph. First, select all '.bars' that
        // currently exist, then load the data into them. enter() selects
        // all the pieces of data and lets us operate on them.
        var dotEnter = dots.selectAll('.dot').data(data).enter();
        var dotExit = dots.selectAll('.dot').data(data).exit();

        var dotsEdit = dots.append('g')
            .selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .filter(function(d) {
            for (i=0;i<lowGenres.length;i++) {
                if (lowGenres[i] == d.genres) {
                    return false;
                }
            }
            return true;
            })
            .attr("id", function(d) {return d.movie_title})
            .attr("stroke", 'black')
            .attr('class', 'dot')

            .attr('cx', function(d) {
                var truePos = xScale(d.genres) + 44;
                var randVary = (Math.random() * Math.round(Math.random()) * 2 - 1);
                var profitLoss = Math.abs(d.gross - d.budget);
                var densityComp = 0;
                if (profitLoss == 0) {
                    return truePos;
                } else if (profitLoss < 40000000){
                    densityComp = 25;
                } else if (profitLoss < 80000000){
                    densityComp = 20;
                } else if (profitLoss < 120000000){
                    densityComp = 15;
                } else if (profitLoss < 150000000){
                    densityComp = 10;
                }  else if (profitLoss < 300000000){
                    densityComp = 1;
                }
                var x = truePos + (randVary * densityComp);
                return x;
            })
            .attr('cy', function(d) {
                return yScale(d.gross - d.budget);
            })

            //make transition for opacity and radius
            //set initial values first, transition, then
            //set values you're transitioning to
            .attr('r', 1) //initial radius
            .style("opacity", 0) //initial opacity
            .on('click', function(d) {
                console.log(d.gross - d.budget);
                console.log(d.movie_facebook_likes);
                console.log(d.movie_title);
            })
            .transition()
            .delay(function(d,i) {
                return Math.random() * yScale(d.gross - d.budget) * 15;
            })
            .style("opacity",.3) //desired opacity
            .attr("r", function(d) { //desired radius
                return rScale(d.movie_facebook_likes)
            })
            .duration(640);



    });
    document.getElementById(filterSwitchedOff).disabled = true;
}

function switchFilter(filterType, toSwitchOff) {
            document.getElementById(filterSwitchedOff).disabled = false;
            document.getElementById(toSwitchOff).disabled = true;
            filterSwitchedOff = toSwitchOff;
            var yScale = d3.scaleLinear().range([10, height - 10]);
            var svg = d3.select("svg").transition();
            d3.csv('movies.csv', function(d) {
                d.budget = +d.budget;
                d.gross = +d.gross;
                d.movie_facebook_likes = +d.movie_facebook_likes;
                d.genres = d.genres.split("|")[0];
                return d;
            }, function(error, data) {
                switch (filterType) {
                    case 'profit':
                        yScale.domain([d3.max(data, function(e) {
                            return e.gross - e.budget;
                        }) + 20000000, -200000000]);
                        svg.selectAll('.dot')
                            .duration(750)
                            .attr('cy', function(d) {
                                return yScale(d.gross - d.budget);
                            })
                        svg.select('.y.axis')
                            .duration(750)
                            .call(d3.axisLeft(yScale).ticks(height/20).tickFormat(d3.format(".2s")))
                        break;
                    case 'budget':
                        yScale.domain([d3.max(data, function(e) {
                            return e.budget;
                        }) + 20000000, d3.min(data, function(e) {
                            return e.budget;
                        })]);
                        svg.selectAll('.dot')
                            .duration(750)
                            .attr('cy', function(d) {
                                return yScale(d.budget);
                            })
                        svg.select('.y.axis')
                            .duration(750)
                            .call(d3.axisLeft(yScale).ticks(height/20).tickFormat(d3.format(".2s")))
                        break;
                    case 'revenue':
                        yScale.domain([d3.max(data, function(e) {
                            return e.gross;
                        }) + 20000000, d3.min(data, function(e) {
                            return e.gross;
                        })]);
                        svg.selectAll('.dot')
                            .duration(750)
                            .attr('cy', function(d) {
                                return yScale(d.gross);
                            })
                        svg.select('.y.axis')
                            .duration(750)
                            .call(d3.axisLeft(yScale).ticks(height/20).tickFormat(d3.format(".2s")))
                        break;
                }
            });
        }