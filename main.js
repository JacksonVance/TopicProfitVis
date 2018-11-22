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
    var xScale = d3.scale.ordinal().rangeBands([0, width]);
    var yScale = d3.scale.linear().range([10, height - 10]);
    var rScale = d3.scale.linear().range([5, 50]);

    // Tell D3 to create a y-axis scale for us, and orient it to the left.
    // That means the labels are on the left, and tick marks on the right.
    var xAxis = d3.svg.axis().scale(xScale);
    var yAxis = d3.svg.axis().scale(yScale).orient('left');


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

        // We set the domain of the xScale. The domain includes 0 up to
        // the maximum frequency in the dataset. This is because
        xScale.domain(data.map(function(d){
            return d.genres;
        }));

        // We set the domain of the yScale. Our scale is linear with a minimum at the
        //highest loss, and a max at the highest profit. So the max difference and the
        //minimum difference with negatives counted.
        yScale.domain([d3.max(data, function(e) {
            return e.gross - e.budget;
        }) + 20000000, -200000000]);

        rScale.domain([0, d3.max(data, function(d) {
            return d.movie_facebook_likes;
        })]);

        dots.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(50, 0)')
            .call(yAxis.ticks(height/20).tickFormat(d3.format("s")));

        dots.append("g")
            .attr('class', 'x axis')
            .attr('transform', 'translate(50,'+ (height - 20) + ' )')
            .call(xAxis);

        // Create the bars in the graph. First, select all '.bars' that
        // currently exist, then load the data into them. enter() selects
        // all the pieces of data and lets us operate on them.
        var dotEnter = dots.selectAll('.dot').data(data).enter();
        var dotExit = dots.selectAll('.dot').data(data).exit();

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
    });
}