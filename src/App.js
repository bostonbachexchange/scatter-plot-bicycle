import "./App.css";
import { useEffect, useState } from "react";
import * as d3 from "d3";

function App() {
  const [data, setData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
        );
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      drawScatterPlot();
      console.log("data", data);
    }
  }, [data]);

  function ApiRequestData() {
    return (
      <>
        <div>
          {data
            ? data.map((item, i) => (
                <div key={i}>
                  <b>Doping:</b> {item.Doping} <br />
                  <b>Name:</b> {item.Name} <br />
                  <b>Place:</b> {item.Place} <br />
                  <b>Nationality:</b> {item.Nationality} <br />
                  <b>Seconds:</b> {item.Secons} <br />
                  <b>Time:</b> {item.Time} <br />
                  <b>Url:</b> {item.URL} <br />
                  <b>Year:</b> {item.Year} <br />
                  <br />
                </div>
              ))
            : null}
        </div>
      </>
    );
  }

  const noDopingColor = "rgb(255, 127, 14)";
  const DopingColor = "rgb(31, 119, 180)";
  const width = 800;
  const height = 600;
  const padding = 40;

  const drawScatterPlot = () => {
    d3.select(".App svg").remove();

    const xScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d)=> d.Year - 1) , d3.max(data, (d)=> d.Year + 1)])
      .range([padding, width - padding]);

    const yScale = d3
      .scaleTime()
      .domain([d3.min(data, (d)=> {return new Date(d.Seconds * 1000)}), d3.max(data, (d)=> {return new Date(d.Seconds * 1000)})])
      .range([padding, height - padding]);

    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.format('d'));

    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.timeFormat("%M:%S"));

    const tooltip = d3
      .select('#tooltip')

    const svg = d3
      .select("#scatterContainer")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "beige");

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => xScale(d.Year)) // d.Year
      .attr("cy", (d, i) => yScale(new Date(d.Seconds * 1000))) // d.Time
      .attr("r", 6)
      .attr("fill", (d) => {
        return d.Doping ? DopingColor : noDopingColor;
      })
      .attr("class", "dot")
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => {return new Date(d.Seconds * 1000)})
      .on('mouseover', (event, d)=> {
        tooltip.transition()
          .style('visibility', 'visible')
          .attr('data-year', d.Year)
          
        tooltip.html(`<div >
          <b>Doping:</b> ${d.Doping} <br />
          <b>Name:</b> ${d.Name} <br />
          <b>Place:</b> ${d.Place} <br />
          <b>Nationality:</b> ${d.Nationality} <br />
          <b>Seconds:</b> ${d.Secons} <br />
          <b>Time:</b> ${d.Time} <br />
          <b>Url:</b> ${d.URL} <br />
          <b>Year:</b> ${d.Year} <br />
          <br />
        </div>`)
      })
      .on("mouseout", (event, d)=> {
        tooltip.transition()
        .style("visibility", "hidden")
      })

    svg
      .append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`);

    svg
      .append("g")
      .call(yAxis)
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`);

      // Add legend in the middle of the SVG
      d3.select("#scatterContainer")
        .append("div")
        .attr("id", "legend")
        .html(
          `<div style="border: 1px solid black; border-radius: 3px">
            <div style="display: flex; align-items: center; margin-right: 0px; width: 100%;">
              <p >No doping allegations  </p>
              <div style="display: inline-block; width: 20px; height: 20px; background-color: orange;"></div>
            </div>
            <div style="display: flex; align-items: center;">
              <p>Riders with doping allegations</p>
              <div style="display: inline-block; width: 20px; height: 20px; background-color: blue;"></div>
            </div>
        </div>`
        )
        .style("position", "absolute")
        .style("top", `${height/ 1.5}px`)
        .style("left", `${width}px`)
        .style("transform", `translate(-50%, -50%)`); 

  };

  return (
    <div className="App">
      <h1 id="title">Doping in Professional Bicycle Racing</h1>
      <p id="subTitle">35 Fastest times up Alpe d'Huez</p>
      <div id="scatterContainer"></div>
      <div id='tooltip'></div>
      {/* <ApiRequestData /> */}
    </div>
  );
}

export default App;
