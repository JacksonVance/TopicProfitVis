// Your browser will call the onload() function when the document
// has finished loading. In this case, onload() points to the
// start() method we defined below. Because of something called
// function hoisting, the start() method is callable on line 6
// even though it is defined on line 8.
window.onload = start;

// This is where all of our javascript code resides. This method
// is called by "window" when the document (everything you see on
// the screen) has finished loading.
function start() {
    // Select the graph from the HTML page and save
    // a reference to it for later.
    var graph = document.getElementById('graph');

    // Specify the width and height of our graph
    // as variables so we can use them later.
    // Remember, hardcoding sucks! :)
    var width = window.innerWidth;
    var height = window.innerHeight;

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
        .attr('width', width)
        .attr('height', height);

    var dots = svg.append('g');


    // Our bar chart is going to encode the profit along different topics
    // This means that the length of the x axis depends on the number of categories.
    // The y axis should cover the range of profits/losses of the data.
    var xScale = d3.scaleBand().rangeRound([0, width]);
    var yScale = d3.scaleLinear().range([10, height - 10]);
    var rScale = d3.scaleLinear().range([5, 25]);





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
        d.x = xScale(d.genres) + 74;
        d.y = yScale(d.gross - d.budget);
        return d;
    }, function(error, data) {

        xScale.domain(data.map(function(d){
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
            .attr('transform', 'translate(50, 0)')
            .call(d3.axisLeft(yScale).ticks(height/20).tickFormat(d3.format(".2s")));

        dots.append("g")
            .attr('class', 'x axis')
            .attr('transform', 'translate(50,'+ (height - 20) + ' )')
            .call(d3.axisBottom(xScale));

        // Create the bars in the graph. First, select all '.bars' that
        // currently exist, then load the data into them. enter() selects
        // all the pieces of data and lets us operate on them.
        var dotEnter = dots.selectAll('.dot').data(data).enter();
        var dotExit = dots.selectAll('.dot').data(data).exit();

        var simulation = d3.forceSimulation(dots)
            .force('collide', d3.forceCollide(function(d){return rScale(d.movie_facebook_likes) + 5}))
            // .force('collision', d3.forceCollide().radius(function(d) {
            //     return rScale(d.movie_facebook_likes)
            // }))
            //.on('tick', ticked);

        dots.append('g')
            .selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr("id", function(d) {return d.movie_title})
            .attr("stroke", 'black')
            .attr('class', 'dot')
            .attr('cx', function(d) {
                return xScale(d.genres) + 74;
            })
            .attr('cy', function(d) {
                return yScale(d.gross - d.budget);
            })
            .attr('r', d=>rScale(d.movie_facebook_likes))
            .on('click', function(d) {
                console.log(d.gross - d.budget);
                console.log(d.movie_facebook_likes);
                console.log(d.movie_title);
            });

        // function ticked() {
        //   var u = d3.select('svg')
        //     .selectAll('circle')
        //     .data(dots)

        //   u.enter()
        //     .append('circle')
        //     .merge(u)
        //     .attr('cx', function(d) {
        //       return d.x
        //     })
        //     .attr('cy', function(d) {
        //       return d.y
        //     })

        //   u.exit().remove()
        // }
    });
}
