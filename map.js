const width = 960, height = 600;

const svg = d3.select("#map").append("svg")
  .attr("width", width)
  .attr("height", height);

const projection = d3.geoNaturalEarth1().scale(160).translate([width / 2, height / 2]);
const path = d3.geoPath().projection(projection);

const colorScale = d3.scaleLinear()
  .domain([0.0, 0.6])
  .range(["#deebf7", "#08306b"]);

const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const nameFix = {
  "USA": "United States of America",
  "UK": "United Kingdom",
  "Russia": "Russian Federation",
  "South Korea": "Republic of Korea",
  "North Korea": "Dem. Rep. Korea",
  "Iran": "Iran (Islamic Republic of)",
  "Syria": "Syrian Arab Republic",
  "Venezuela": "Venezuela (Bolivarian Republic of)",
  "Bolivia": "Bolivia (Plurinational State of)",
  "Tanzania": "United Republic of Tanzania",
  "Moldova": "Republic of Moldova",
  "Vietnam": "Viet Nam",
  "Laos": "Lao People's Democratic Republic",
  "Ivory Coast": "Côte d'Ivoire",
  "Czech Republic": "Czechia",
  "Democratic Republic of the Congo": "Democratic Republic of the Congo"
};

Promise.all([
  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
  d3.json("prevalence_by_country.json")
]).then(([world, prevalenceData]) => {
  const countries = topojson.feature(world, world.objects.countries).features;
  const prevalenceMap = Object.fromEntries(prevalenceData.map(d => [d.Country, d.Prevalence]));

  svg.selectAll("path")
    .data(countries)
    .join("path")
    .attr("d", path)
    .attr("fill", d => {
      const name = d.properties.name;
      const matchedKey = Object.keys(prevalenceMap).find(k => {
        return k === name || nameFix[k] === name || name === nameFix[k];
      });
      return matchedKey ? colorScale(prevalenceMap[matchedKey]) : "#eee";
    })
    .attr("stroke", "#999")
    .on("mouseover", function (event, d) {
      const name = d.properties.name;
      const matchedKey = Object.keys(prevalenceMap).find(k => {
        return k === name || nameFix[k] === name || name === nameFix[k];
      });
      const prevalence = prevalenceMap[matchedKey];
      if (prevalence !== undefined) {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`<strong>${name}</strong><br>Prevalence: ${(prevalence * 100).toFixed(1)}%`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      }
    })
    .on("mouseout", () => tooltip.transition().duration(500).style("opacity", 0));

    Promise.all([
  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
  d3.json("prevalence_by_country.json")
]).then(([world, prevalenceData]) => {
  const countries = topojson.feature(world, world.objects.countries).features;
  const prevalenceMap = Object.fromEntries(prevalenceData.map(d => [d.Country, d.Prevalence]));

  // Draw the map
  svg.selectAll("path")
    .data(countries)
    .join("path")
    .attr("d", path)
    .attr("fill", d => {
      const name = d.properties.name;
      const matchedKey = Object.keys(prevalenceMap).find(k => {
        return k === name || nameFix[k] === name || name === nameFix[k];
      });
      return matchedKey ? colorScale(prevalenceMap[matchedKey]) : "#eee";
    })
    .attr("stroke", "#999")
    .on("mouseover", function (event, d) {
      const name = d.properties.name;
      const matchedKey = Object.keys(prevalenceMap).find(k => {
        return k === name || nameFix[k] === name || name === nameFix[k];
      });
      const prevalence = prevalenceMap[matchedKey];
      if (prevalence !== undefined) {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`<strong>${name}</strong><br>Prevalence: ${(prevalence * 100).toFixed(1)}%`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      }
    })
    .on("mouseout", () => tooltip.transition().duration(500).style("opacity", 0));

  // ✅ ⬇️ ADD LEGEND HERE ⬇️
  const legendWidth = 300;
  const legendHeight = 10;

  const legendSvg = svg.append("g")
    .attr("transform", `translate(${width - legendWidth - 50},${height - 40})`);

  const gradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "legend-gradient")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "100%").attr("y2", "0%");

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#deebf7");

  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#08306b");

  legendSvg.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#legend-gradient)")
    .attr("stroke", "#000");

  const legendScale = d3.scaleLinear()
    .domain([0, 0.6])
    .range([0, legendWidth]);

  const legendAxis = d3.axisBottom(legendScale)
    .tickFormat(d => `${(d * 100).toFixed(0)}%`)
    .ticks(6);

  legendSvg.append("g")
    .attr("transform", `translate(0, ${legendHeight})`)
    .call(legendAxis);

  legendSvg.append("text")
    .attr("x", legendWidth / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "#03396c")
    .text("Alzheimer’s Prevalence");
});

// Add a color legend
const legendWidth = 300;
const legendHeight = 10;

const legendSvg = svg.append("g")
  .attr("transform", `translate(${width - legendWidth - 50},${height - 40})`);

const gradient = svg.append("defs")
  .append("linearGradient")
  .attr("id", "legend-gradient")
  .attr("x1", "0%").attr("y1", "0%")
  .attr("x2", "100%").attr("y2", "0%");

gradient.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", "#deebf7");

gradient.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#08306b");

legendSvg.append("rect")
  .attr("width", legendWidth)
  .attr("height", legendHeight)
  .style("fill", "url(#legend-gradient)")
  .attr("stroke", "#000");

const legendScale = d3.scaleLinear()
  .domain([0, 0.6])
  .range([0, legendWidth]);

const legendAxis = d3.axisBottom(legendScale)
  .tickFormat(d => `${(d * 100).toFixed(0)}%`)
  .ticks(6);

legendSvg.append("g")
  .attr("transform", `translate(0, ${legendHeight})`)
  .call(legendAxis);

legendSvg.append("text")
  .attr("x", legendWidth / 2)
  .attr("y", -10)
  .attr("text-anchor", "middle")
  .style("font-size", "12px")
  .style("fill", "#03396c")
  .text("Alzheimer’s Prevalence");



});