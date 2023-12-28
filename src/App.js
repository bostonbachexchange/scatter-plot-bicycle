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

// Inside the ApiRequestData component
function ApiRequestData() {
  return (
    <div className="ApiRequestData">
      <p className="ApiRequestDataTitle">Cyclist Information</p>
      {data ? (
        data.map((item, i) => (
          <div className="ApiRequestDataItem" key={i}>
            <div className="ApiRequestDataHeader">
              <h2>{item.Name}</h2>
              <p>{item.Year}</p>
            </div>

            <div className="ApiRequestDataContent">

              { item.Doping && 
              <p>
                <span className="ApiRequestDataLabel">Doping:</span>
                <span className="ApiRequestDataValue">{item.Doping}</span>
              </p>
              }
              <p>
                <span className="ApiRequestDataLabel">Place:</span>
                <span className="ApiRequestDataValue">{item.Place}</span>
              </p>

              <p>
                <span className="ApiRequestDataLabel">Nationality:</span>
                <span className="ApiRequestDataValue">{item.Nationality}</span>
              </p>

              <p>
                <span className="ApiRequestDataLabel">Time:</span>
                <span className="ApiRequestDataValue">{item.Time}</span>
              </p>

              {item.URL && <p>
                <span className="ApiRequestDataLabel">Url:</span>
                <a className="ApiRequestDataLink" href={item.URL} target="_blank" rel="noopener noreferrer">
                  {item.URL}
                </a>
              </p>}
            </div>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
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

    let tooltip = d3.select("body #tooltip");

    if (tooltip.empty()) {
      tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')
        .style('position', 'absolute')
        .style('background-color', '#333')
        .style('opacity', '0.8')
        .style('color', '#fff')
        .style('padding', '12px')
        .style('border-radius', '8px')
        .style('box-shadow', '0 0 10px rgba(0, 0, 0, 0.5)')
        .style('font-family', 'Arial, sans-serif')
        .style('font-size', '14px')
        .style('line-height', '1.5')
        .style('pointer-events', 'none');  
  }


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
          
          if (d.Doping) {
            tooltip.html(`<div class="tooltip-content">
                <b>Doping:</b> ${d.Doping} <br />
                <b>Name:</b> ${d.Name} <br />
                <b>Place:</b> ${d.Place} <br />
                <b>Nationality:</b> ${d.Nationality} <br />
                <b>Seconds:</b> ${d.Seconds} <br />
                <b>Time:</b> ${d.Time} <br />
                <b>Url:</b> ${d.URL} <br />
                <b>Year:</b> ${d.Year} <br />
                <br />
            </div>`);
        } else {
            tooltip.html(`<div class="tooltip-content">
                <b>Name:</b> ${d.Name} <br />
                <b>Place:</b> ${d.Place} <br />
                <b>Nationality:</b> ${d.Nationality} <br />
                <b>Seconds:</b> ${d.Seconds} <br />
                <b>Time:</b> ${d.Time} <br />
                <b>Year:</b> ${d.Year} <br />
                <br />
            </div>`);
        }
        
        tooltip.attr("data-year", d.Year)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 28}px`);
      })
      .on('mousemove', (event, d) => {
        const [x, y] = d3.pointer(event);
        tooltip.style('left', x + 'px').style('top', y + 'px');
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
          `<div class="legend-box">
            <div class="legend-item">
              <div class="legend-color-box" style="background-color: rgb(255, 127, 14);"></div>
              <p class="legend-text">No doping allegations</p>
            </div>
            <div class="legend-item">
              <div class="legend-color-box" style="background-color: rgb(31, 119, 180);"></div>
              <p class="legend-text">Riders with doping allegations</p>
            </div>
          </div>`
        )
        .style("position", "absolute")
        .style("top", `${height/ 3}px`)
        .style("left", `${width}px`)
        .style("transform", `translate(-5%, -60%)`); 

  };

  return (
    <div className="App">
      <h1 id="title">Doping in Professional Bicycle Racing</h1>
      <p id="subTitle">35 Fastest times up Alpe d'Huez</p>
      <div id="scatterContainer"></div>
      <ApiRequestData />
    </div>
  );
}

export default App;
