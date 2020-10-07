//Initialize svg w / h
var svgWidth = 750;
var svgHeight = 560;
//Initialize margins
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 50
};
//Define w / h margins for graph
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create an SVG wrapper to append SVG group 
//holds chart and h / w info
var svg = d3
    .select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

//Append SVG Group
var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

//maintenance
d3.csv('assets/data/data.csv', function(data){
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    return data;
}).then(function(data) {
    console.log(data);

//Create x/y scales
var xScale = d3.scaleLinear()
    .domain([8, d3.max(data,function(d){
    return +d.poverty;
    })])
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain([2, d3.max(data,function(d){
    return +d.healthcare;
    })])
    .range([height, 0]);

//Create axis
var bottomAxis = d3.axisBottom(xScale);
var leftAxis = d3.axisLeft(yScale);

//Appending axes
chartGroup.append('g')
    .attr("style", `transform:translate(0, ${height}px)`)
    .call(bottomAxis);
chartGroup.append('g')
    .call(leftAxis);

//circle data points
var circlesGroup = chartGroup.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d,i) => xScale(d.poverty))
    .attr('cy', d => yScale(d.healthcare))
    .attr('r', '15')
    .attr('fill', 'blue')
    .classed('stateCircle', true)

console.log(chartGroup.selectAll('text').data(data));

//State abbreviations
//________________________________________________________________________________________________
//unsure why only 26 are found. The csv file is formatted correctly, 
//'selectAll' works for the circles, however it only finds 26 of the text elements. 
//Unclear on how to proceed when the text is clearly there just isn't found with select all  :/
//________________________________________________________________________________________________
chartGroup.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('style', 'fill:red')
    .attr('x', (d,i) => xScale(d.poverty))
    .attr('y', d => (yScale(d.healthcare-0.28)))
    .classed('stateText', true)
    .text(d => d.abbr)

//apend x labels
chartGroup.append('text')
    .attr('transform','rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - height/2)
    .attr('dy', '1em')
    .classed('aText', true)
    .attr('data-axis-name','healthcare')
    .text('Lacks Healthcare(%)');

//append y labels
chartGroup.append('text')
    .attr('transform',"translate("+width/2+" ," +(height+margin.top+20)+ ")")
    .attr('data-axis-name','poverty')
    .classed('aText', true)
    .text('In Poverty (%)');

//toolTip
var toolTip = d3.tip()
    .attr('class', 'tooltip')
    .offset([-10,30])
    .html(function(d) {
        return (`${d.abbr}<br>Healthcare (%): ${d.healthcare}%<br>Poverty: ${d.poverty}`);
    });


//tool tip for hover 
chartGroup.call(toolTip);

// Event listener for tool tip
circlesGroup.on('mouseover', function(d) {
    toolTip.show(d);
})
    .on('mouseout', function(d, i){
        toolTip.hide(d);
    });

});
