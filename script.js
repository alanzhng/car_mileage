let currentSlide = 0;
const slides = d3.selectAll(".slide");

function showSlide(n) {
    slides.style("display", "none");
    slides.filter((d, i) => i === n).style("display", "block");
    currentSlide = n;

    // Call the respective scene functions based on the slide index
    if (currentSlide === 1) {
        scene1();
    } else if (currentSlide === 2) {
        scene2();
    } else if (currentSlide === 3) {
        scene3();
    }
}

function nextSlide() {
    if (currentSlide < slides.size() - 1) {
        showSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

async function scene2() {
    d3.select("#pie-chart").selectAll("*").remove();

    const width = 1000;
    const height = 600;
    const radius = Math.min(width, height) / 2 - 50;

    const dataset = await d3.csv("https://flunky.github.io/cars2017.csv");

    const svg = d3.select("#pie-chart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create a pie chart layout
    const pie = d3.pie()
        .value((d) => d.value)
        .sort(null);

    // Create an arc generator
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Process the data to count occurrences of each unique fuel type
    const fuelCounts = dataset.reduce((acc, curr) => {
        acc[curr.Fuel] = (acc[curr.Fuel] || 0) + 1;
        return acc;
    }, {});

    const fuelData = Object.entries(fuelCounts).map(([key, value]) => ({ key, value }));

    // Calculate the average aggregated city MPG per fuel type
    const fuelAggregatedHighwayMPG = dataset.reduce((acc, curr) => {
        acc[curr.Fuel] = (acc[curr.Fuel] || 0) + +curr.AverageHighwayMPG;
        return acc;
    }, {});

    Object.keys(fuelAggregatedHighwayMPG).forEach(fuelType => {
        const count = fuelCounts[fuelType];
        const avgHighwayMPG = (fuelAggregatedHighwayMPG[fuelType] / count).toFixed(2);
        fuelData.find(d => d.key === fuelType).avgHighwayMPG = avgHighwayMPG;
    });



    // Create the pie slices
    const arcs = svg.selectAll(".arc")
        .data(pie(fuelData))
        .enter()
        .append("g")
        .attr("class", "arc")
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);

    const tooltipGroup = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    tooltipGroup.append("rect")
        .attr("width", 220)
        .attr("height", 30)
        .attr("fill", "rgba(255, 255, 255, 0.9)")
        .attr("stroke", "#999")
        .attr("stroke-width", 1)
        .attr("rx", 5)
        .attr("ry", 5);

    const tooltipText = tooltipGroup.append("text")
        .attr("x", 5)
        .attr("y", 20)
        .style("font-size", "12px")
        .style("font-weight", "bold");

    function showTooltip(event, d) {
        const xPosition = +d3.select(this).attr("x");
        const yPosition = +d3.select(this).attr("y");

        tooltipGroup.attr("transform", `translate(${xPosition},${yPosition})`)
            .style("display", "block");

        const fuelType = event.data.key;
        const avgHighwayMPG = event.data.avgHighwayMPG;

        tooltipText.text(`${fuelType} - Avg Highway MPG: ${avgHighwayMPG}`);
    }

    function hideTooltip() {
        tooltipGroup.style("display", "none");
    }

    // Fill the pie slices with different colors
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i))
        .attr("stroke", "white")
        .attr("stroke-width", 2);

    // Add labels to the pie slices
    const arcLabel = d3.arc().innerRadius(radius * 0.6).outerRadius(radius * 0.6);

    arcs.append("text")
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text(d => d.data.key);

    // Add a title for the pie chart
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", 0)
        .attr("y", -height / 2 + 40)
        .attr("text-anchor", "middle")
        .text("Fuel Type Distribution");
}





async function scene1() {
    d3.select("#chart").selectAll("*").remove();

    const margin = { top: 100, right: 70, bottom: 100, left: 70 };
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const dataset = await d3.csv("https://flunky.github.io/cars2017.csv");

    const svg = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let currentData = "AverageCityMPG";

    const title = svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", -20)
        .text("Average City MPG by Make");


    const xScale = d3.scaleBand()
        .domain(dataset.map(d => d["Make"]))
        .range([0, width])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => +d[currentData])])
        .range([height, 0]);

    const bars = svg.selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d["Make"]))
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(+d[currentData]))
        .attr("height", d => height - yScale(+d[currentData]))
        .attr("fill", currentData === "AverageCityMPG" ? "#8B0000" : "#00008B")
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);

    const tooltipGroup = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    tooltipGroup.append("rect")
        .attr("width", 100)
        .attr("height", 30)
        .attr("fill", "rgba(255, 255, 255, 0.9)")
        .attr("stroke", "#999")
        .attr("stroke-width", 1)
        .attr("rx", 5)
        .attr("ry", 5);

    const tooltipText = tooltipGroup.append("text")
        .attr("x", 5)
        .attr("y", 20)
        .style("font-size", "12px")
        .style("font-weight", "bold");

    function showTooltip(event, d) {
        const xPosition = +d3.select(this).attr("x") + xScale.bandwidth() / 2;
        const yPosition = +d3.select(this).attr("y") - 10;

        tooltipGroup.attr("transform", `translate(${xPosition},${yPosition})`)
            .style("display", "block");

        tooltipText.text(dataset[d]["Make"]);
    }

    function hideTooltip() {
        tooltipGroup.style("display", "none");
    }

    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + 80)
        .text("Make");

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("transform", "rotate(-90)")
        .text("MPG");

    svg.append("g")
        .call(d3.axisLeft(yScale));

    function toggleData() {
        currentData = currentData === "AverageCityMPG" ? "AverageHighwayMPG" : "AverageCityMPG";

        yScale.domain([0, d3.max(dataset, d => +d[currentData])]);

        title.text(`${currentData === "AverageCityMPG" ? "Average City" : "Average Highway"} MPG by Make`);

        bars.transition()
            .duration(1000)
            .attr("y", d => yScale(+d[currentData]))
            .attr("height", d => height - yScale(+d[currentData]))
            .attr("fill", currentData === "AverageCityMPG" ? "#8B0000" : "#00008B");
    }

    document.querySelector(".toggle-button button").addEventListener("click", toggleData);
}


async function scene3() {
    d3.select("#scatter-plot").selectAll("*").remove();
    const dataset = await d3.csv("https://flunky.github.io/cars2017.csv");

    const margin = { top: 50, right: 50, bottom: 70, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#scatter-plot")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    dataset.forEach(d => {
        d["EngineCylinders"] = +d["EngineCylinders"];
        d["AverageCityMPG"] = +d["AverageCityMPG"];
    });

    const xScale = d3.scaleLinear()
        .domain([d3.min(dataset, d => d["EngineCylinders"]), d3.max(dataset, d => d["EngineCylinders"])])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(dataset, d => d["AverageCityMPG"]), d3.max(dataset, d => d["AverageCityMPG"])])
        .range([height, 0]);

    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d["EngineCylinders"]))
        .attr("cy", d => yScale(d["AverageCityMPG"]))
        .attr("r", 5)
        .attr("fill", "steelblue");

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Engine Cylinders");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .attr("transform", "rotate(-90)")
        .text("City MPG");

    const zoom = d3.zoom()
        .scaleExtent([0.5, 10])
        .on("zoom", zoomed);

    svg.call(zoom);

    function zoomed() {
        const currentTransform = d3.event.transform;

        const new_xScale = currentTransform.rescaleX(xScale);
        const new_yScale = currentTransform.rescaleY(yScale);

        svg.selectAll("circle")
            .attr("cx", d => new_xScale(d["EngineCylinders"]))
            .attr("cy", d => new_yScale(d["AverageCityMPG"]));

        svg.select(".x-axis").call(d3.axisBottom(new_xScale));
        svg.select(".y-axis").call(d3.axisLeft(new_yScale));
    }
}


document.addEventListener("DOMContentLoaded", () => {
    showSlide(currentSlide);
});

document.querySelector(".slide#chart-slide .toggle-button button").addEventListener("click", scene1());

document.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") {
        nextSlide();
    } else if (event.key === "ArrowLeft") {
        prevSlide();
    }
});

