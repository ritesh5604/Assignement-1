import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import './Weather.css';
import { fetchWeatherInfo, fetchForecast } from '../services/weatherService';

const MAX_RECENTS = 5;

export default function SearchBox({ updateInfo, updateForecast }) {
    const [city, setCity] = useState("");
    const [lastCity, setLastCity] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("recentCities")) || [];
        setRecentSearches(saved);
    }, []);

    const updateRecentSearches = (newCity) => {
        const updated = [newCity, ...recentSearches.filter(c => c.toLowerCase() !== newCity.toLowerCase())];
        const trimmed = updated.slice(0, MAX_RECENTS);
        setRecentSearches(trimmed);
        localStorage.setItem("recentCities", JSON.stringify(trimmed));
    };

    const fetchAndUpdate = async (cityName) => {
        try {
            setError("");
            setIsLoading(true);

            const weatherData = await fetchWeatherInfo(cityName);
            const forecastData = await fetchForecast(cityName);

            if (!weatherData || weatherData.city === 'N/A') {
                throw new Error("City not found or API failed.");
            }

            updateInfo(weatherData);
            updateForecast(forecastData);

            updateRecentSearches(cityName);
            setLastCity(cityName);
        } catch (err) {
            setError(err.message || "Something went wrong while fetching data.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setCity(e.target.value);
        if (error) setError(""); // Clear error when user starts typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedCity = city.trim();
        if (!trimmedCity) return;
        await fetchAndUpdate(trimmedCity);
        setCity("");
    };

    const handleRecentClick = async (cityName) => {
        await fetchAndUpdate(cityName);
    };

    const handleRefresh = async () => {
        if (lastCity) {
            await fetchAndUpdate(lastCity);
        }
    };

    const handleClearRecent = () => {
        setRecentSearches([]);
        localStorage.removeItem("recentCities");
    };

    return (
        <div className="search">
            <form onSubmit={handleSubmit}>
                <TextField
                    label="City Name"
                    variant="outlined"
                    value={city}
                    onChange={handleChange}
                    error={Boolean(error)}
                    helperText={error || ""}
                    required
                />
                <br /><br />
                <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    type="submit"
                    disabled={!city.trim() || isLoading}
                >
                    {isLoading ? "Loading..." : "Send"}
                </Button>

                &nbsp;

                <Button
                    variant="outlined"
                    endIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                    disabled={!lastCity || isLoading}
                >
                    Refresh
                </Button>
            </form>

            {isLoading && (
                <div className="loader">
                    <CircularProgress size={24} />
                    <p>Fetching weather data...</p>
                </div>
            )}

            {error && (
                <div className="error-message">
                    <Alert severity="error">{error}</Alert>
                </div>
            )}

            {recentSearches.length > 0 && (
                <div className="recent-searches">
                    <div className="recent-header">
                        <h4>Recent Searches</h4>
                        <button className="clear-btn" onClick={handleClearRecent}>Clear</button>
                    </div>
                    <ul>
                        {recentSearches.map((item, index) => (
                            <li key={index}>
                                <button onClick={() => handleRecentClick(item)}>{item}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
