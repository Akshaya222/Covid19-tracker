import "./styles.css";
import React, { useState, useEffect } from "react";
import { FormControl, Select, MenuItem } from "@material-ui/core";
import { Card, CardContent, Typography } from "@material-ui/core";
import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from "./utils";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import { sortData } from "./utils";
import Map from "./Map";
import Table from "./Table";
export default function App() {
  const [mapcountries, setMapcountries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [singleCountry, setSingleCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapcenter, setMapcenter] = useState({
    lat: 34.80746,
    lng: -40.4796
  });
  const [mapzoom, setMapzoom] = useState(3);
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));
          setMapcountries(data);
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  useEffect(() => {
    const getSingleCountry = async () => {
      const url =
        singleCountry === "worldwide"
          ? "https://disease.sh/v3/covid-19/all"
          : `https://disease.sh/v3/covid-19/countries/${singleCountry}`;
      await fetch(url)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("data is data is", data.countryInfo);
          setCountryInfo(data);
          if (singleCountry !== "worldwide") {
            const lat = data?.countryInfo?.lat;
            const lng = data?.countryInfo?.long;
            console.log("lat is", lat, lng);
            const latlng = {
              lat,
              lng
            };
            setMapcenter(latlng);
            setMapzoom(4);
          }
        });
    };
    getSingleCountry();
  }, [singleCountry]);
  console.log("country ingo", countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl variant="outlined">
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={singleCountry}
              onChange={(e) => {
                setSingleCountry(e.target.value);
              }}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => {
                return (
                  <MenuItem key={country.name} value={country.name}>
                    {country.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            title="Coronavirus Cases"
            onClick={() => {
              setCasesType("cases");
            }}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            title="Recovered"
            onClick={() => {
              setCasesType("recovered");
            }}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            onClick={() => {
              setCasesType("deaths");
            }}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map
          center={mapcenter}
          zoom={mapzoom}
          countries={mapcountries}
          casesType={casesType}
        />
      </div>
      <div className="app__right">
        <Card>
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3 className="app__graphTitle">Worldwide new cases</h3>
            <LineGraph casesType={casesType} className="app__graph" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
