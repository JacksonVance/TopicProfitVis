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

    var graph = document.getElementById('graph');


    var svg = d3.select(graph)
        .append('svg')
        .attr('width', width + 40)
        .attr('height', height + 50);


    var dots = svg.append('g');
    var profitOptions = d3.select(graph).append('select').text('Profit Range').attr('id', 'profitRange');
        profitOptions.append('option')
                    .text("Profit (Loss) Range")
                    .attr('value', 'null');
        profitOptions.append('option')
                    .text("200M+")
                    .attr('value', '0');
        profitOptions.append('option')
                    .text("100-200M")
                    .attr('value', '1');
        profitOptions.append('option')
                    .text("50-100M")
                    .attr('value', '2');
        profitOptions.append('option')
                    .text("(50)-50M")
                    .attr('value', '3');
        profitOptions.append('option')
                    .text("(100)-(50M)")
                    .attr('value', '4');
        profitOptions.append('option')
                    .text("(200)-(100M)")
                    .attr('value', '5');

    d3.select(graph).append('p');

    d3.select(graph).append('input').text('Title Search').attr('id', 'title').attr('type', 'text');

    d3.select(graph)
        .append("p")
        .append('button')
        .text('Select Nodes')
        .on('click', function() {
            dots.selectAll('.dot')
                .filter(function(d) {
                    if (d.movie_title.toLowerCase() === ($('#title').val()).toLowerCase()) {
                        console.log("found");
                        editNode(d);
                    }
                    switch ($('#profitRange').val()) {
                        case 'null':
                            break;
                        case '0':
                            var rangeArray = [200000000, 1000000000];
                            var profit = d.gross - d.budget;
                            console.log(rangeArray[0]);
                            if (profit > rangeArray[0] && profit < rangeArray[1]) {
                                editNode(d);
                            }
                            break;
                        case '1':
                            var rangeArray = [100000000, 200000000];
                            var profit = d.gross - d.budget;
                            console.log(rangeArray[0]);
                            if (profit > rangeArray[0] && profit < rangeArray[1]) {
                                editNode(d);
                            }
                            break;
                        case '2':
                            var rangeArray = [50000000, 100000000];
                            var profit = d.gross - d.budget;
                            console.log(rangeArray[0]);
                            if (profit > rangeArray[0] && profit < rangeArray[1]) {
                                editNode(d);
                            }
                            break;
                        case '3':
                            var rangeArray = [-50000000, 50000000];
                            var profit = d.gross - d.budget;
                            console.log(rangeArray[0]);
                            if (profit > rangeArray[0] && profit < rangeArray[1]) {
                                editNode(d);
                            }
                            break;
                        case '4':
                            var rangeArray = [-100000000, -50000000];
                            var profit = d.gross - d.budget;
                            console.log(rangeArray[0]);
                            if (profit > rangeArray[0] && profit < rangeArray[1]) {
                                editNode(d);
                            }
                            break;
                        case '5':
                            var rangeArray = [-200000000, -100000000];
                            var profit = d.gross - d.budget;
                            console.log(rangeArray[0]);
                            if (profit > rangeArray[0] && profit < rangeArray[1]) {
                                editNode(d);
                            }
                            break;
                    }
                    // if ($('#profitRange').val() != null) {
                    //     var rangeArray = $('#profitRange').val();
                    //     var profit = d.gross - d.budget;
                    //     console.log(rangeArray[0]);
                    //     if (profit > rangeArray[0] && profit < rangeArray[1]) {
                    //         editNode(d);
                    //     }
                    // }
                })
        })


    var xScale = d3.scaleBand().rangeRound([45, width - 10]);
    var yScale = d3.scaleLinear().range([10, height - 10]);
    var rScale = d3.scaleLinear().range([3, 25]);


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
        d.movie_title = d.movie_title;
        if (d.budget == 600000000) {d.budget = 8577000}
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

        svg.append("text")
            .attr("class", "x axis label")
            // .attr("x", 400) -> also works to code the individual aspects of your "translate"
            // .attr("y", 500)
            .attr("transform", "translate(" + (width/2) + ", " + (height + 40) + ")")
            .style("font-weight", "bold")
            .style("font-size", "85%")
            .text("Movie Genre");
         svg.append("text")
            .attr("class", "y axis label")
            .attr("transform", "translate(12, " + (height/2) + "), rotate(-90)")
            .style("font-weight", "bold")
            .style("font-size", "85%")
            .text("Profit / Loss");

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
                svg.append("text")
                    .attr("x", (width/2))
                    .attr("y", 150)
                    .style("font-weight", "bold")
                    .text(d.movie_title)
                 svg.append("text")
                    .attr("x", (width/2))
                    .attr("y", 175)
                    .text("Profit: $" + (comma(d.gross - d.budget)))
                 svg.append("text")
                    .attr("x", (width/2))
                    .attr("y", 200)
                    .text("Director: " + (d.director_name))
                editNode(d);
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

function comma(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function editNode(node) {
    var element = document.getElementById(node.movie_title);
    if (element.getAttribute('class') != 'dot selected')
        element.setAttribute('class', 'dot selected');
    else {
        element.setAttribute('class', 'dot');
    }
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
                if (d.budget == 600000000) {d.budget = 8577000}
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
                        svg.select('.y.axis.label')
                            .duration(750)
                            .text('Profit/Loss');
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
                        svg.select('.y.axis.label')
                            .duration(750)
                            .text('Budget');
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
                        svg.select('.y.axis.label')
                            .duration(750)
                            .text('Revenue');
                        svg.select('.y.axis')
                            .duration(750)
                            .call(d3.axisLeft(yScale).ticks(height/20).tickFormat(d3.format(".2s")))
                        break;
                }
            });
        }