import './App.css';
import { useEffect, useState } from 'react';
import * as d3 from "d3";


function App() {

  const [data, setData] = useState()
  useEffect(()=> {
    const fetchData = async () => {
      try {
        const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json");
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData()
  }, [])
  
  useEffect(()=> {
    if(data) {
      drawScatterPlot();
      console.log('data', data);
    }
  }, [data])

function ApiRequestData() {
  return (
    <>
    <div>{data? data.map((item, i) => <div key={i}>
    <b>Doping:</b> {item.Doping} <br/> 
    <b>Name:</b> {item.Name} <br/> 
    <b>Place:</b> {item.Place} <br/> 
    <b>Nationality:</b> {item.Nationality} <br/> 
    <b>Seconds:</b> {item.Secons} <br/> 
    <b>Time:</b> {item.Time} <br/> 
    <b>Url:</b> {item.URL} <br/> 
    <b>Year:</b> {item.Year} <br/> 
    <br/> 
    </div>) : null}</div>
    </>
  )
}

  const noDopingColor = "rgb(255, 127, 14)";
  const DopingColor = "rgb(31, 119, 180)";
  const width = 800;
  const height = 600;
  const padding = 40;

  const drawScatterPlot = () => {

    d3.select(".App svg").remove()

    const xScale = d3.scaleLinear()
      // .domain([0 , data.length - 1])
      .range([padding,  width - padding])
    
    const yScale = d3.scaleTime()
      .range([padding, height - padding])

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    const svg = d3.select('#scatterContainer')
      .append("svg")
      .attr('width', width)
      .attr('height', height)
      .style('background-color', 'beige')

      svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d, i)=>  i * 10 ) // d.Year
        .attr('cy', (d, i)=> 600 - parseInt(d.Time, 10) * 10) // d.Time
        .attr('r', 4)
        .attr('fill', (d)=> {return d.Doping? DopingColor : noDopingColor})
        .attr('class', 'dot')
  
      svg.append('g')
        .call(xAxis)
        .attr('id', "x-axis")
        .attr('transform', `translate(0, ${height - padding})`)

      svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding}, 0)`)
  }

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
