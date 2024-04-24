import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faSun, faCloud, faCloudRain, faSnowflake, faWind, faTint, faEye } from '@fortawesome/free-solid-svg-icons';
import './WeatherApp.css';

function TempApp() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [background, setBackground] = useState('');

  useEffect(() => {
    if (searchQuery === '') {
      fetchWeatherByLocation();
    } else {
      fetchWeatherByQuery();
    }
  }, [searchQuery]);

  useEffect(() => {
    if (weatherData) {
      setBackground(getBackground(weatherData.weather[0].main));
    }
  }, [weatherData]);

  const fetchWeatherByLocation = async () => {
    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=5e9f522325bd5aebca09cafdb8d33d12`);
      const data = await response.json();
      setWeatherData(data);
      setError('');
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Error fetching weather data');
    }
  };

  const fetchWeatherByQuery = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=5e9f522325bd5aebca09cafdb8d33d12`);
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      setWeatherData(data);
      setError('');
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('City not found');
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      }

      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear':
        return <FontAwesomeIcon icon={faSun} />;
      case 'Clouds':
        return <FontAwesomeIcon icon={faCloud} />;
      case 'Rain':
        return <FontAwesomeIcon icon={faCloudRain} />;
      case 'Snow':
        return <FontAwesomeIcon icon={faSnowflake} />;
      default:
        return <FontAwesomeIcon icon={faSun} />;
    }
  };

  const handleSearch = () => {
    setSearchQuery(document.getElementById('searchInput').value);
  };

  const getBackground = (condition) => {
    switch (condition) {
      case 'Clear':
        return 'linear-gradient(to bottom, #2196F3, #64B5F6)';
      case 'Clouds':
        return 'linear-gradient(to bottom, #78909C, #CFD8DC)';
      case 'Rain':
        return 'linear-gradient(to bottom, #607D8B, #B0BEC5)';
      case 'Snow':
        return 'linear-gradient(to bottom, #B0BEC5, #ECEFF1)';
      default:
        return 'linear-gradient(to bottom, #2196F3, #64B5F6)';
    }
  };

  return (
    <div className="weather-app" style={{ background }}>
      <div className="sky">
        <div className="weather-container">
          <div className="weather-info">
            <div className="current-weather">
              <div className="location-icon">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              {weatherData && (
                <>
                  <h2 className="location">{weatherData.name}</h2>
                  <div className="temperature">
                    {getWeatherIcon(weatherData.weather[0].main)} {Math.round(weatherData.main.temp - 273.15)}°C
                  </div>
                  <div className="weather-description">{weatherData.weather[0].description}</div>
                  <div className="weather-forecast">
                    <div className="weather-info-item">
                      <FontAwesomeIcon icon={faWind} />
                      Wind Speed: {weatherData.wind.speed} m/s
                    </div>
                    <div className="weather-info-item">
                      <FontAwesomeIcon icon={faTint} />
                      Humidity: {weatherData.main.humidity}%
                    </div>
                    <div className="weather-info-item">
                      <FontAwesomeIcon icon={faEye} />
                      Visibility: {weatherData.visibility / 1000} km
                    </div>
                    <div className="weather-info-item">
                      <FontAwesomeIcon icon={faTint} />
                      Pressure: {weatherData.main.pressure} hPa
                    </div>
                  </div>
                </>
              )}
              {error && <div className="error-message">{error}</div>}
            </div>
          </div>
          <div className="search-container">
            <input id="searchInput" type="search" placeholder="Search location..." />
            <button onClick={handleSearch} className='search'>Search</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TempApp;
