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
var mode = 'Profit';
var node;
function start() {

    var graph = document.getElementById('graph');


    var svg = d3.select(graph)
        .append('svg')
        .attr('width', width + 40)
        .attr('height', height + 50);


    var dots = svg.append('g');
    d3.select(graph).append('p');
    d3.select(graph).append('text').attr('id', 'selection-header').text('Select Nodes By:')
    d3.select(graph).append('p');
    d3.select(graph).append('text').attr('class', 'header').text('Profit/Loss Range')
    d3.select(graph).append('br');
    d3.select(graph).append('text').attr('id', 'range-side').text('Max  ');
    var selRangeMax = d3.select(graph).append('input').attr('id', 'rangeMax').attr('placeholder', 'i.e. 1000000');
    d3.select(graph).append('br')
    d3.select(graph).append('text').attr('id', 'range-side').text('      Min     ');
    var selRangeMin = d3.select(graph).append('input').attr('id', 'rangeMin').attr('placeholder', 'i.e. -1000000');

    d3.select(graph).append('p');
    d3.select(graph).append('text').attr('class', 'header').text('Director Name');
    d3.select(graph).append('br');
    d3.select(graph).append('input').text('Director Search').attr('id', 'directorSearch').attr('type', 'text').attr('placeholder', 'i.e. Christopher Nolan');

    d3.select(graph).append('p');
    d3.select(graph).append('text').attr('class', 'header').text('Facebook Likes');
    d3.select(graph).append('br');
    var likeOptions = d3.select(graph).append('select').attr('id', 'likesSelect');
        likeOptions.append('option')
                    .text('-select-')
                    .attr('value', '0');
        likeOptions.append('option')
                    .text('+200,000')
                    .attr('value', '1');
        likeOptions.append('option')
                    .text('150,000-200,000')
                    .attr('value', '2');
        likeOptions.append('option')
                    .text('100,000-150,000')
                    .attr('value', '3');
        likeOptions.append('option')
                    .text('75,000-100,000')
                    .attr('value', '4');
        likeOptions.append('option')
                    .text('50,000-75,000')
                    .attr('value', '5');
        likeOptions.append('option')
                    .text('25,000-50,000')
                    .attr('value', '6');
        likeOptions.append('option')
                    .text('10,000-25,000')
                    .attr('value', '7');
        likeOptions.append('option')
                    .text('1,000-10,000')
                    .attr('value', '8');
        likeOptions.append('option')
                    .text('<1,000')
                    .attr('value', '9');



    d3.select(graph).append('p');
    d3.select(graph)
        .append("p")
        .append('button')
        .text('Select Nodes')
        .on('click', function() {
            dots.selectAll('.dot')
                .filter(function(d) {
                    if (d.director_name.toLowerCase() === ($('#title').val()).toLowerCase() && d.director_name != '') {
                        editNode(d);
                    }
                    if ($('#rangeMax').val() != null && $('#rangeMin').val() != null && $('#rangeMax').val() != $('#rangeMin').val()) {
                        console.log('wrong');
                        var rangeArray = [Number($('#rangeMax').val()), Number($('#rangeMin').val())];
                        var profit = d.gross - d.budget;
                        if (profit < rangeArray[0] && profit > rangeArray[1]) {
                            editNode(d);
                        }
                    }
                    switch (Number($('#likesSelect').val())) {
                        case 0:
                            break;
                        case 1:
                            var rangeArray = [1000000,200000];
                            var likes = d.movie_facebook_likes;
                            if (likes < rangeArray[0] && likes > rangeArray[1]) {
                                editNode(d);
                            }
                            break;
                        case 2:
                            var rangeArray = [200000,150000];
                            var likes = d.movie_facebook_likes;
                            if (likes < rangeArray[0] && likes > rangeArray[1]) {
                                editNode(d);
                            }
                            break;
                        case 3:
                            var rangeArray = [150000,100000];
                            var likes = d.movie_facebook_likes;
                            if (likes < rangeArray[0] && likes > rangeArray[1]) {
                                editNode(d);
                            }
                            break;
                        case 4:
                            var rangeArray = [100000,75000];
                            var likes = d.movie_facebook_likes;
                            if (likes < rangeArray[0] && likes > rangeArray[1]) {
                                editNode(d);
                            }
                            break;
                        case 5:
                            var rangeArray = [75000,50000];
                            var likes = d.movie_facebook_likes;
                            if (likes < rangeArray[0] && likes > rangeArray[1]) {
                                editNode(d);
                            }
                            break;
                        case 1:
                            var rangeArray = [50000,25000];
                            var likes = d.movie_facebook_likes;
                            if (likes < rangeArray[0] && likes > rangeArray[1]) {
                                editNode(d);
                            }
                            break;
                        case 1:
                            var rangeArray = [25000,10000];
                            var likes = d.movie_facebook_likes;
                            if (likes < rangeArray[0] && likes > rangeArray[1]) {
                                editNode(d);
                            }
                            break;
                        case 1:
                            var rangeArray = [10000,1000];
                            var likes = d.movie_facebook_likes;
                            if (likes < rangeArray[0] && likes > rangeArray[1]) {
                                editNode(d);
                            }
                            break;
                        case 1:
                            var rangeArray = [1000,0];
                            var likes = d.movie_facebook_likes;
                            if (likes < rangeArray[0] && likes > rangeArray[1]) {
                                editNode(d);
                            }
                            break;
                    }
                })
        })

    d3.select(graph)
        .append('p')
        .append('button')
        .text('Reset')
        .on('click', function() {
            dots.selectAll('.dot')
                .filter(function(d) {
                    var element = document.getElementById(d.movie_title);
                    element.setAttribute('class', 'dot');
                })
                .classed('dot selection', console.log('working'))
                .classed('dot', true)
        })


    var xScale = d3.scaleBand().rangeRound([45, width - 10]);
    var yScale = d3.scaleLinear().range([10, height - 10]);
    var rScale = d3.scaleLinear().range([3, 20]);


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
            .attr("stroke", '#108985')
            .attr('class', 'dot')

            .attr('cx', function(d) {
                var truePos = xScale(d.genres) + 44;
                var randVary = (Math.random(120) * Math.round(Math.random()) * 2 - 1);
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
                console.log(d.director_name);
                $(".metadata").remove();
                svg.append("text")
                    .attr('class', 'metadata')
                    .attr("x", (width/2))
                    .attr("y", 150)
                    .style("font-weight", "bold")
                    .text(d.movie_title)
                 svg.append("text")
                    .attr('class', 'metadata view')
                    .attr("x", (width/2))
                    .attr("y", 175)
                    .text(function() {
                        switch (mode) {
                            case 'Profit':
                                return mode + ": $" + (comma(d.gross - d.budget));
                                break;
                            case 'Budget':
                                return mode + ": $" + (comma(d.budget));
                                break;
                            case 'Revenue':
                                return mode + ": $" + (comma(d.gross));
                                break;
                        }

                    })
                 svg.append("text")
                    .attr('class', 'metadata')
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

function editNode(newNode) {
    node = newNode;
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
                        mode = 'Profit';
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
                        if (node != null) {
                            console.log('working');
                            svg.select('.metadata.view')
                                .duration(750)
                                .text(mode + ": $" + (comma(node.gross - node.budget)))
                        }
                        svg.select('.y.axis')
                            .duration(750)
                            .call(d3.axisLeft(yScale).ticks(height/20).tickFormat(d3.format(".2s")))
                        break;
                    case 'budget':
                        mode = 'Budget';
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
                        if(node != null) {
                            svg.select('.metadata.view')
                                .duration(750)
                                .text(mode + ": $" + (comma(node.budget)))
                        }
                        svg.select('.y.axis')
                            .duration(750)
                            .call(d3.axisLeft(yScale).ticks(height/20).tickFormat(d3.format(".2s")))
                        break;
                    case 'revenue':
                        mode = 'Revenue';
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
                        if(node != null) {
                            svg.select('.metadata.view')
                                .duration(750)
                                .text(mode + ": $" + (comma(node.gross)))
                        }
                        svg.select('.y.axis')
                            .duration(750)
                            .call(d3.axisLeft(yScale).ticks(height/20).tickFormat(d3.format(".2s")))
                        break;
                }
            });
        }