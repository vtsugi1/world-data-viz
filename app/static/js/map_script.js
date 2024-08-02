// Width and height of the map
const width = 960;
const height = 600;

// Create SVG element
const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Create a projection
const projection = d3.geoNaturalEarth1()
    .scale(170)
    .translate([width / 2, height / 2]);

const path = d3.geoPath()
    .projection(projection);

// Create a tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load and process data
Promise.all([
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    d3.csv("/static/data/sample_olympics_2024.csv", function(d) {
        return {
            year: +d.year,
            host_city: d.host_city,
            country: d.country,
            population: +d.population,
            number_of_athletes: +d.number_of_athletes,
            athletes_per_thousand: (+d.number_of_athletes / +d.population) * 1000000
        };
    })
]).then(function([world, data]) {

    let colorScale; // Declare colorScale globally to update it later

    // Function to update the map based on the selected metric
    function updateMap(metric) {
        // Calculate the actual maximum value for the metric, with clamping if needed
        const maxValue = d3.max(data, d => d[metric]);

        // Optional: Clamp the max value to avoid outliers dominating the scale
        const clampedMaxValue = Math.min(maxValue, 50);  // Example: cap at 50

        // Create a color scale with a broader range
        colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
            .domain([0, clampedMaxValue]);

        // Update the map
        svg.selectAll("path")
            .data(world.features)
            .join("path")
            .attr("d", path)
            .attr("fill", function(d) {
                const country = data.find(c => c.country === d.properties.name);
                if (country) {
                    return colorScale(country[metric]);
                } else {
                    return "#ccc";
                }
            })
            .style("stroke", "white")
            .on("mouseover", function(event, d) {
                const country = data.find(c => c.country === d.properties.name);
                if (country) {
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(`<strong>Country:</strong> ${country.country}<br>
                                  <strong>Population:</strong> ${country.population.toLocaleString()}<br>
                                  <strong>Number of Athletes:</strong> ${country.number_of_athletes}<br>
                                  <strong>Athletes per 1,000,000:</strong> ${country.athletes_per_thousand.toFixed(2)}`)
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                }
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 5) + "px")
                       .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition().duration(500).style("opacity", 0);
            });

        // Update legend
        svg.selectAll(".legend").remove();
        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(20, 20)");

        const legendScale = d3.scaleLinear()
            .domain(colorScale.domain())
            .range([0, 300]);

        const legendAxis = d3.axisBottom(legendScale)
            .ticks(5)
            .tickFormat(d3.format(".1f"));

        legend.selectAll("rect")
            .data(d3.range(colorScale.domain()[0], colorScale.domain()[1], (colorScale.domain()[1] - colorScale.domain()[0]) / 10))
            .enter()
            .append("rect")
            .attr("x", d => legendScale(d))
            .attr("y", 0)
            .attr("width", 30)
            .attr("height", 10)
            .attr("fill", d => colorScale(d));

        legend.append("g")
            .attr("transform", "translate(0, 10)")
            .call(legendAxis);
    }

    // Initialize the map with the default metric
    updateMap("number_of_athletes");

    // Update the map when the metric is changed
    d3.select("#metric-selector").on("change", function() {
        const selectedMetric = d3.select(this).property("value");
        updateMap(selectedMetric);
    });

    // Initialize the Materialize select component
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    });
});
