const width = 960;
const height = 550;  // Increased height to make space for the title

const svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

// Add a light background to the SVG
svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "none");  // Light gray background to replace the black

const projection = d3.geoNaturalEarth1()
    .scale(170)
    .translate([width / 2, height / 2 + 30]);  // Adjusted to move the map down slightly

const path = d3.geoPath().projection(projection);

// Adjusted color scale based on the new earthquake data
const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
    .domain([-2, 8]); // Domain adjusted to cover the range of earthquake magnitudes

const graticule = d3.geoGraticule();

svg.append("text")
    .attr("x", width / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .text("Earthquakes in the Past 30 Days");

// Load and display world map
d3.json("https://d3js.org/world-110m.v1.json").then(function(world) {

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "#ccc")  // Light gray graticule lines
        .attr("stroke-width", 0.5);

    svg.append("path")
        .datum(graticule.outline)
        .attr("class", "foreground")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "#000")  // Black outline for the globe
        .attr("stroke-width", 1.5);

    // Load and plot earthquake data from https://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php
    d3.csv("/static/data/earthquakes_last_month.csv").then(function(data) {
        const radiusScale = d3.scaleSqrt().domain([-2, 8]).range([0, 10]); // Adjust radius scale

        svg.append("g")
            .selectAll("path")
            .data(topojson.feature(world, world.objects.countries).features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", "lightgray")
            .attr("stroke", "#000");

        svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", d => projection([+d.longitude, +d.latitude])[0])
            .attr("cy", d => projection([+d.longitude, +d.latitude])[1])
            .attr("r", d => radiusScale(Math.max(+d.mag, 0))) // Ensure non-negative radii
            .attr("fill", d => colorScale(Math.max(+d.mag, 0))) // Ensure non-negative colors
            .attr("opacity", 0.6);

        // Add legend
        const legend = d3.select("#map").append(() => Legend(colorScale, {
            title: "Earthquake Magnitude",
            tickFormat: ".1f",
            width: 400,  // Increase the width of the legend
            height: 55,  // Increase the height of the legend
            tickSize: 10,  // Increase the tick size for better visibility
            marginTop: 20,  // Increase the top margin to provide space for the title
            marginBottom: 20  // Increase the bottom margin to provide space below the ticks
        }));
        
        legend.select(".title")
            .style("font-size", "12px");  // Adjust the font size here

        legend.attr("transform", `translate(320, 10)`);  // Adjust legend position
    });
});
