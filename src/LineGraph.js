import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false
  },
  elements: {
    point: {
      radius: 0
    }
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      }
    }
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          unit: "month",
          tooltipFormat: "ll"
        }
      }
    ],
    yAxes: [
      {
        gridLines: {
          display: false
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          }
        }
      }
    ]
  }
};
const buildChartData = (data, casesType = "cases") => {
  const chartData = [];
  let lastDataPoint;
  for (let date in data[casesType]) {
    const newDataPoint = {
      x: date,
      y:
        data[casesType][date] - lastDataPoint > 0
          ? data[casesType][date] - lastDataPoint
          : 0
    };
    chartData.push(newDataPoint);
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

const LineGraph = ({ className }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const getData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const chartData = buildChartData(data, "cases");
          setData(chartData);
          console.log("chartData is", chartData);
        });
    };
    getData();
  }, []);

  return (
    <div className={className}>
      {data?.length > 0 ? (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data
              }
            ]
          }}
          options={options}
          redraw={true}
        />
      ) : null}
    </div>
  );
};

export default LineGraph;
