document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();
    $('#countries').select2({
        width: '100%',
        placeholder: 'Select Countries',
        dropdownAutoWidth: true,
        allowClear: true,
        closeOnSelect: false
    });

    initializeControls();
});

let stopAnimation = false;
const svg = d3.select("#bubbleChart");
const margin = { top: 40, right: 150, bottom: 60, left: 80 };
const width = +svg.attr("width") - margin.left - margin.right;
const height = +svg.attr("height") - margin.top - margin.bottom;
const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);
const z = d3.scaleSqrt().range([2, 30]);

const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y);

g.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`);
g.append("g").attr("class", "y-axis");

// Add X axis label:
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width / 2 + margin.left)
    .attr("y", height + margin.top + 50)
    .text("Population");

// Add Y axis label:
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 55)
    .attr("x", -height / 2 - margin.top)
    .attr("dy", "-2.5em")
    .attr("transform", "rotate(-90)")
    .text("Military Expenditure (% of GDP)");

svg.append("text")
    .attr("class", "title")
    .attr("x", width / 2 + margin.left)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px");

// Tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
}

function populateSelect(selectElement, items) {
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.text = item;
        selectElement.add(option);
    });
}

async function initializeControls() {
    const countries = await fetchData('/countries');
    const years = await fetchData('/years');

    populateSelect(document.getElementById('countries'), countries);
    populateSelect(document.getElementById('startYear'), years);
    populateSelect(document.getElementById('endYear'), years);

    $('#countries').trigger('change'); // Trigger change event to update Select2 options
}

function formatData(data, selectedCountries, year) {
    return data.filter(d => selectedCountries.includes(d.Country) && d.Year === year)
        .map(d => ({
            country: d.Country,
            population: +d.Population,
            militaryExpenditure: +d['Military_Expenditure'],
            gdp: +d.GDP
        }));
}

function updateChart(data, selectedCountries, year, showLabels, bubbleColor) {
    x.domain([0, d3.max(data, d => d.population)]).nice();
    y.domain([0, d3.max(data, d => d.militaryExpenditure)]).nice();
    z.domain([0, d3.max(data, d => d.gdp)]);

    g.select(".x-axis").transition().call(xAxis);
    g.select(".y-axis").transition().call(yAxis);

    const bubbles = g.selectAll(".bubble").data(data, d => d.country);

    bubbles.enter().append("circle")
        .attr("class", "bubble")
        .attr("cx", d => x(d.population))
        .attr("cy", d => y(d.militaryExpenditure))
        .attr("r", d => z(d.gdp))
        .style("fill", bubbleColor)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .on("mouseover", function(event, d) {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`Country: ${d.country}<br>Population: ${d.population}<br>Military Expenditure: ${d.militaryExpenditure}% of GDP<br>GDP: $${d.gdp}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition().duration(500).style("opacity", 0);
        })
        .merge(bubbles)
        .transition()
        .duration(1000)
        .attr("cx", d => x(d.population))
        .attr("cy", d => y(d.militaryExpenditure))
        .attr("r", d => z(d.gdp));

    bubbles.exit().remove();

    if (showLabels) {
        const labels = g.selectAll(".label").data(data, d => d.country);

        labels.enter().append("text")
            .attr("class", "label")
            .attr("x", d => x(d.population))
            .attr("y", d => y(d.militaryExpenditure))
            .attr("dy", -5)
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .style("fill", "black")
            .text(d => d.country)
            .merge(labels)
            .transition()
            .duration(1000)
            .attr("x", d => x(d.population))
            .attr("y", d => y(d.militaryExpenditure));

        labels.exit().remove();
    } else {
        g.selectAll(".label").remove();
    }

    svg.select(".title").text(`Countries: ${selectedCountries.join(', ')} | Year: ${year}`);

    // Legend
    const valuesToShow = [10000000, 100000000, 1000000000];
    const xCircle = width + margin.right / 2;
    const xLabel = xCircle + 30;

    g.selectAll("legend")
        .data(valuesToShow)
        .join("circle")
            .attr("cx", xCircle)
            .attr("cy", d => height - 100 - z(d))
            .attr("r", d => z(d))
            .style("fill", "none")
            .attr("stroke", "black");

    g.selectAll("legend")
        .data(valuesToShow)
        .join("line")
            .attr('x1', d => xCircle + z(d))
            .attr('x2', xLabel)
            .attr('y1', d => height - 100 - z(d))
            .attr('y2', d => height - 100 - z(d))
            .attr('stroke', 'black')
            .style('stroke-dasharray', ('2,2'));

    g.selectAll("legend")
        .data(valuesToShow)
        .join("text")
            .attr('x', xLabel)
            .attr('y', d => height - 100 - z(d))
            .text(d => d / 1000000)
            .style("font-size", 10)
            .attr('alignment-baseline', 'middle');

    svg.append("text")
        .attr('x', xCircle)
        .attr("y", height - 70)
        .text("Population (M)")
        .attr("text-anchor", "middle");
}

async function playAnimation(data, selectedCountries, startYear, endYear, showLabels, bubbleColor) {
    stopAnimation = false;
    for (let year = startYear; year <= endYear; year++) {
        if (stopAnimation) {
            break;
        }
        const formattedData = formatData(data, selectedCountries, year);
        updateChart(formattedData, selectedCountries, year, showLabels, bubbleColor);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between frames
    }
}

document.getElementById('playButton').addEventListener('click', async () => {
    const selectedCountries = Array.from(document.getElementById('countries').selectedOptions).map(option => option.value);
    const startYear = parseInt(document.getElementById('startYear').value);
    const endYear = parseInt(document.getElementById('endYear').value);
    const showLabels = document.getElementById('showLabels').checked;
    const bubbleColor = document.getElementById('bubbleColor').value;
    const data = await fetchData('/data');
    playAnimation(data, selectedCountries, startYear, endYear, showLabels, bubbleColor);

    // Generate text
    const response = await fetch('/generate_text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            countries: selectedCountries,
            start_year: startYear,
            end_year: endYear,
        }),
    });
    const result = await response.json();
    document.getElementById('generatedText').innerText = result.text;
});

document.getElementById('stopButton').addEventListener('click', () => {
    stopAnimation = true;
});

initializeControls();
