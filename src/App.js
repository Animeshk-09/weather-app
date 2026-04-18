import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [city, setCity] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!apiKey.trim()) {
      setError("Enter API key");
      return;
    }

    if (!city.trim()) {
      setError("Enter city");
      return;
    }

    try {
      setError("");
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
      );
      setWeather(res.data);
    } catch (e) {
      setWeather(null);
      if (e.response && e.response.status === 401) setError("Invalid API key");
      else if (e.response && e.response.status === 404) setError("City not found");
      else setError("Error fetching weather");
    }
  };

  const fetchLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        setWeather(res.data);
        setError("");
      } catch {
        setError("Location fetch failed");
      }
    });
  };

  return (
    <div style={{ textAlign: "center", padding: "40px", fontFamily: "Arial" }}>
      <h1>Weather App</h1>

      <input
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{ padding: 10, margin: 5 }}
      />
      <br />

      <input
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: 10, margin: 5 }}
      />
      <br />

      <button onClick={fetchWeather} style={{ margin: 5 }}>
        Search
      </button>

      <button onClick={fetchLocationWeather} style={{ margin: 5 }}>
        Use My Location
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: 20, padding: 20, border: "1px solid #ccc", borderRadius: 10 }}>
          <h2>{weather.name}</h2>
          <p>{weather.main.temp}°C</p>
          <p>{weather.weather[0].main}</p>
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
      )}
    </div>
  );
}