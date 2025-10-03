/* eslint-disable no-undef */

import React, { useEffect, useState } from "react";
import WeatherBackground from "./components/weather";
import convertTemperature, {
  getVisibilityValue,
  getWindDirection,
  getHumidityValue,
} from "./components/helper";

import {
  HumidityIcon,
  WindIcon,
  VisibilityIcon,
  SunriseIcon,
  SunsetIcon,
}from '../src/components/icons';

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [unit, setUnit] = useState("C");
  const [error, setError] = useState("");
  const API_KEY = "17f6cd1842bfed4d8288d12ac4f47e2b";

  useEffect(() => {
    if (city.trim().length >= 3 && !weather) {
      const timer = setTimeout(() => fetchSuggestions(city), 500);
      return () => clearTimeout(timer);
    }
    setSuggestion([]);
  }, [city, weather]);

  // Fetch city suggestions
  const fetchSuggestions = async (query) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setSuggestion(data);
    } catch {
      console.error("Failed to fetch suggestions");
    }
  };

  // Helper to get weather condition for background
  const getWeatherCondition = () =>
    weather && weather.weather && {
      main: weather.weather[0].main,
      isDay:
        Date.now() / 1000 > weather.sys.sunrise &&
        Date.now() / 1000 < weather.sys.sunset,
    };

  // Fetch weather by city name or lat/lon
  const fetchWeatherData = async (url, cityLabel = "") => {
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod && data.cod !== 200) {
        // API returned an error (like "city not found")
        setError(data.message || "Failed to fetch weather data");
        setWeather(null);
        return;
      }

      setWeather(data);
      setCity(cityLabel || data.name);
      setSuggestion([]);
      setError("");
    } catch {
      setError("Failed to fetch weather data. Please try again.");
    }
  };

  // Handle form submit
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return setError("Please enter a city name");

    await fetchWeatherData(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city.trim()
      )}&appid=${API_KEY}&units=metric`
    );
  };

  return (
    <div className="min-h-screen">
      <WeatherBackground condition={getWeatherCondition()} />
      <div className="flex items-center justify-center p-6 min-h-screen">
        <div className="bg-transparent backdrop-filter backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md text-white w-full border border-white/30 relative z-10">
          <h1 className="text-4xl font-extrabold text-center mb-6">
            Weather App
          </h1>

          {/* FORM SECTION */}
          {!weather ? (
            <form onSubmit={handleSearch} className="flex flex-col relative">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter City or Country (min 3 letters)"
                className="p-3 mb-4 rounded border border-white bg-transparent text-white placeholder-white focus:outline-none focus:border-blue-300 transition duration-300"
              />
              {suggestion.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-black/50 shadow-md rounded z-10">
                  {suggestion.map((s) => (
                    <button
                      className="block hover:bg-blue-700 bg-transparent px-4 py-2 text-sm text-left w-full transition-colors"
                      type="button"
                      key={`${s.lat}-${s.lon}`}
                      onClick={() =>
                        fetchWeatherData(
                          `https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid=${API_KEY}&units=metric`,
                          `${s.name}, ${s.country}${
                            s.state ? ", " + s.state : ""
                          }`
                        )
                      }
                    >
                      {`${s.name}, ${s.country}${
                        s.state ? ", " + s.state : ""
                      }`}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="submit"
                className="bg-purple-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Get Weather
              </button>
              {error && (
                <p className="text-red-400 text-center mt-2">{error}</p>
              )}
            </form>
          ) : (
            /* WEATHER DETAILS SECTION */
            <div className="mt-6 text-center transition-opacity duration-500">
              <button
                onClick={() => {
                  setWeather(null);
                  setCity("");
                }}
                className="bg-purple-700 hover:bg-blue-700 mb-4 text-white font-semibold py-1 px-3 rounded transition-colors"
              >
                New Search
              </button>
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">{weather.name}</h2>
                <button
                  onClick={() => setUnit((u) => (u === "C" ? "F" : "C"))}
                  className="bg-purple-700 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded transition-colors"
                >
                  {unit === "C" ? "Switch to °F" : "Switch to °C"}
                </button>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="mx-auto my-4 animate-bounce"
              />

              <p className="text-4xl">
                {convertTemperature(weather.main.temp, unit)}&deg;{unit}
              </p>

              <p className="capitalize">{weather.weather[0].description}</p>

              <div className="flex flex-wrap justify-around mt-6">
                {[
                  [
                    HumidityIcon,
                    "Humidity",
                    `${weather.main.humidity}% (${getHumidityValue(
                      weather.main.humidity
                    )})`,
                  ],
                  [
                    WindIcon,
                    "Wind",
                    `${weather.wind.speed} m/s (${getWindDirection(
                      weather.wind.deg
                    )})`,
                  ],
                  [
                    VisibilityIcon,
                    "Visibility",
                    getVisibilityValue(weather.visibility),
                  ],
                ].map(([Icon, label, value]) => (
                  <div key={label} className="flex flex-col items-center m-2">
                    {Icon && <Icon />}
                    <p className="mt-1 font-semibold">{label}</p>
                    <p className="text-sm">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-around mt-6">
                {[
                  [SunriseIcon, "Sunrise", weather.sys.sunrise],
                  [SunsetIcon, "Sunset", weather.sys.sunset],
                ].map(([Icon, label, time]) => (
                  <div key={label} className="flex flex-col items-center m-2">
                    {Icon && <Icon />}
                    <p className="mt-1 font-semibold">{label}</p>
                    <p className="text-sm ">
                      {new Date(time * 1000).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-sm ">
                <p>
                  <strong>Feels Like:</strong>{" "}
                  {convertTemperature(weather.main.feels_like, unit)} &deg;
                  {unit}
                </p>
                <p>
                  <strong>Pressure:</strong> {weather.main.pressure} hPa
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
