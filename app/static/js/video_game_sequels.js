// Set up the SVG canvas dimensions
const margin = { top: 40, right: 20, bottom: 100, left: 100 };
const width = 960 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the data from the Flask endpoint
d3.json('/top_50_games').then(data => {

    // Sort data by score in descending order
    data.sort((a, b) => d3.descending(a.Metacritic_score, b.Metacritic_score));

    // Set up the scales
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.Name))
        .padding(0.2);

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, d => d.Metacritic_score)]);

    // Add the x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Add the y-axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the bars
    svg.selectAll("bars")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d =>x(d.Name))
        .attr("y", d =>y(d.Metacritic_score))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.Metacritic_score))
        .attr("fill", "#69b3a2");

    // Add labels to the bars
    svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d =>x(d.Name) + x.bandwidth() / 2)
        .attr("y", d =>y(d.Metacritic_score) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.Metacritic_score);
});
