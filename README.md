# React Scatter Plot Project

This is a React project that fetches cyclist data from a JSON file and visualizes it using a scatter plot. The data is sourced from [freeCodeCamp](https://www.freecodecamp.org/) and represents the 35 fastest times up Alpe d'Huez.

## Deployed Application

The application is deployed and can be accessed at [Deployed Link](https://bostonbachexchange.github.io/scatter-plot-bicycle/).

## Getting Started

To run this project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-react-project.git
   cd your-react-project

stall dependencies:
bash
Copy code
npm install
Start the development server:
bash
Copy code
npm start
Open your browser and navigate to http://localhost:3000 to view the application.
Project Structure

App.js: The main component that fetches data, renders the scatter plot, and includes the ApiRequestData component for displaying cyclist information.
ApiRequestData.js: A component responsible for rendering cyclist information in a tabular format.
Dependencies

React: A JavaScript library for building user interfaces.
D3.js: A JavaScript library for manipulating documents based on data. Used for creating the scatter plot.
Data Source

The cyclist data is fetched from the following URL:

Cyclist Data
Scatter Plot Features

X-axis: Represents the years of the cyclist data.
Y-axis: Represents the time taken by cyclists to complete the race.
Color Coding: Cyclists with doping allegations are represented in a different color.
Tooltip: Hover over data points to view detailed information about each cyclist.
Legend

No doping allegations: Represented by a circle with a color box in orange.
Riders with doping allegations: Represented by a circle with a color box in blue.
Additional Information

The project uses React hooks, including useEffect and useState, for fetching and managing data.
D3.js is employed for creating the scatter plot and handling interactivity.
The legend is positioned to the right of the scatter plot for clarity.
Feel free to explore, modify, and expand upon this project for your needs! If you have any questions or suggestions, please don't hesitate to reach out.