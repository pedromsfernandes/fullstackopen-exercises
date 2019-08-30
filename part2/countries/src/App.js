import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({ country, weather }) => (
  <>
    <h3>Weather in {country.capital}</h3>
    <p>
      <b>temperature:</b> {weather.current.temp_c} Celsius
    </p>
    <img
      src={weather.current.condition.icon}
      alt={weather.current.condition.text}
    />
    <p>
      <b>wind:</b> {weather.current.wind_kph} kph direction{" "}
      {weather.current.wind_dir}
    </p>
  </>
);

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const capital = country.capital;

  useEffect(() => {
    axios
      .get(
        `https://api.apixu.com/v1/current.json?key=d68b6835e6db4591b17134600193008&q=${capital}`
      )
      .then(response => setWeather(response.data));
  }, [capital]);

  return (
    <>
      <h2>{country.name}</h2> <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h3>languages</h3>
      <ul>
        {country.languages.map(language => (
          <li key={language.iso639_1}>{language.name}</li>
        ))}
      </ul>
      <img
        style={{ width: "250px", height: "250px" }}
        src={country.flag}
        alt={country.name}
      />
      {weather && <Weather country={country} weather={weather} />}
    </>
  );
};

const App = () => {
  const [filterText, setFilterText] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios
      .get("https://restcountries.eu/rest/v2/all")
      .then(response => setCountries(response.data));
  }, []);

  const displayCountries = () => {
    if (filterText === "") return;

    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filtered.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    }

    if (filtered.length > 1) {
      return (
        <ul>
          {filtered.map(country => (
            <li key={country.name}>
              {country.name}{" "}
              <button
                onClick={() => {
                  const index = countries.findIndex(
                    originalCountry => originalCountry.name === country.name
                  );
                  setCountries(
                    Object.assign([...countries], {
                      [index]: {
                        ...country,
                        display:
                          country.display === undefined
                            ? true
                            : !country.display
                      }
                    })
                  );
                }}
              >
                show
              </button>
              {country.display && <Country country={country} />}
            </li>
          ))}
        </ul>
      );
    }

    if (filtered.length === 1) {
      return <Country country={filtered[0]} />;
    }
  };

  return (
    <div>
      find countries{" "}
      <input
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
      ></input>
      <div>{displayCountries()}</div>
    </div>
  );
};

export default App;
