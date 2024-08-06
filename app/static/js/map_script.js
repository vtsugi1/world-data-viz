// Width and height of the map
const width = 1200;
const height = 800;

// Create SVG element for the map
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

    let colorScale;

    // Function to update the map based on the selected metric
    function updateMap(metric) {
        // Calculate metric values for the selected countries
        const metricValues = data.map(d => d[metric]).filter(value => !isNaN(value));

        // Calculate the median and standard deviation
        const median = d3.median(metricValues);
        const stdDev = d3.deviation(metricValues);

        // Define the scale domain based on the median and one standard deviation
        const minValue = Math.max(0, median - stdDev); // Ensure minValue is not negative
        const maxValue = median + stdDev;

        // Create the color scale
        colorScale = d3.scaleSequential(d3.interpolateViridis)
            .domain([minValue, maxValue]);

        // Update the map
        svg.selectAll("path")
            .data(world.features)
            .join("path")
            .attr("d", path)
            .attr("fill", function(d) {
                const country = data.find(c => c.country === d.properties.name);
                if (country && !isNaN(country[metric])) {
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
                                  <strong>Athletes per 1,000,000 People:</strong> ${country.athletes_per_thousand.toFixed(2)}`)
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

        // Remove any existing legend
        d3.select("#legend").remove();

        // Add a new legend with dynamic title and formatted ticks
        const legendTitle = {
            "number_of_athletes": "Number of Athletes",
            "athletes_per_thousand": "Athletes per 1,000 People",
            "population": "Population"
        };

        const tickFormat = d3.format(".0f");

        const legendSvg = d3.select("#map").append(() => Legend(colorScale, {
            title: legendTitle[metric] || "Metric",
            tickFormat: d => {
                if (d >= 1000000) return `${(d / 1000000).toFixed(0)}MM`;
                if (d >= 1000) return `${(d / 1000).toFixed(0)}K`;
                return tickFormat(d);
            },
            width: 300 // Adjust the width as needed
        }));

        legendSvg.attr("id", "legend")
                 .attr("transform", `translate(${width - 350}, ${height - 900})`); // Adjust positioning as needed
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
