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
});