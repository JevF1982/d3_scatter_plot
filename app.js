const w = 800;
const h = 800;
const padding = 90;

var url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

d3.json(url, (data) => {
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  //format Y values
  const timeFormat = "%M:%S";
  const yTime = data.map((item) => d3.timeParse(timeFormat)(item.Time));

  console.log(data);

  // format x values
  const yearFormat = "%Y";
  const xYear = data.map((item) => d3.timeParse(yearFormat)(item.Year));

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .style("opacity", 0);

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(xYear))
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(yTime))
    .range([h - padding, padding]);

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 6)
    .attr("cx", (d, i) => xScale(d3.timeParse(yearFormat)(d.Year)))
    .attr("cy", (d) => yScale(d3.timeParse(timeFormat)(d.Time)))
    .attr("fill", "navy")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d3.timeParse(timeFormat)(d.Time))
    .style("fill", (d) => color(d.Doping != ""))
    .on("mouseover", function (d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          d.Name +
            ":" +
            d.Nationality +
            "</br>" +
            "Year :" +
            d.Year +
            "</br>" +
            "Time :" +
            d.Time +
            "</br>" +
            d.Doping
        )
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY + 20 + "px")
        .attr("data-year", d.Year);
    })
    .on("mouseout", function () {
      tooltip.transition().duration(400).style("opacity", 0);
    });

  const xAxis = d3.axisBottom(xScale);

  const yAxis = d3
    .axisLeft(yScale)
    .tickValues(yTime)
    .tickFormat((item) => d3.timeFormat(timeFormat)(item));

  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .attr("id", "x-axis")
    .call(xAxis)
    .append("text")
    .attr("y", 60)
    .attr("x", w / 2)
    .style("font-size", "20px")
    .style("text-anchor", "middle")
    .text("Year")
    .style("fill", "black");
  svg
    .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .attr("id", "y-axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -h / 2)
    .style("font-size", "20px")
    .style("text-anchor", "middle")
    .text("Best Time (minutes)")
    .style("fill", "black");

  const legendContainer = svg.append("g").attr("id", "legend");

  const legend = legendContainer
    .selectAll("#legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend-label")
    .attr("transform", function (d, i) {
      return "translate(0," + (h / 2 - i * 20) + ")";
    });

  legend
    .append("rect")
    .attr("x", w - 40)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend
    .append("text")
    .attr("x", w - 45)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function (d) {
      if (d) return "Riders with doping allegations";
      else {
        return "No doping allegations";
      }
    });
});
