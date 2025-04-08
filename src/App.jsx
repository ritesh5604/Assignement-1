import React, { useState, useMemo } from 'react';
import {
  Container,
  Box,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { motion, AnimatePresence } from 'framer-motion';

import SearchBox from './components/SearchBox';
import WeatherCard from './components/WeatherCard';
import RecentSearches from './components/RecentSearch';
import Forecast from './components/ForeCast';
import './App.css';

const API_KEY = '382185ad0a2038b9e17b16b33c4f63d8';

export default function App() {
  const [weatherInfo, setWeatherInfo] = useState({});
  const [forecastData, setForecastData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );

  const fetchAllWeatherData = async (city) => {
    try {
      setLoading(true);
      setError('');

      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      const weatherJson = await weatherRes.json();
      const forecastJson = await forecastRes.json();

      if (weatherJson.cod !== 200 || forecastJson.cod !== '200') {
        throw new Error('City not found or API failed');
      }

      const current = {
        city: weatherJson.name,
        Temp: weatherJson.main.temp ?? 'N/A',
        Min_Temp: weatherJson.main.temp_min ?? 'N/A',
        Max_Temp: weatherJson.main.temp_max ?? 'N/A',
        Feels_Like: weatherJson.main.feels_like ?? 'N/A',
        Humidity: weatherJson.main.humidity ?? 'N/A',
        Weather: weatherJson.weather?.[0]?.description ?? 'N/A',
      };

      setWeatherInfo(current);
      setForecastData(forecastJson.list);
    } catch (err) {
      console.error('Weather fetch error:', err.message);
      setError(err.message || 'Something went wrong.');
      setWeatherInfo({});
      setForecastData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={4}>
          <Typography variant="h4">🌤️ Weather Wizard</Typography>
          <IconButton onClick={() => setDarkMode((prev) => !prev)} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>

        {/* Search Input */}
        <Box mb={3}>
          <SearchBox
            updateInfo={(info) => setWeatherInfo(info)}
            updateForecast={(forecast) => setForecastData(forecast)}
          />
        </Box>

        {/* Loading State */}
        {loading && (
          <Box textAlign="center" my={4}>
            <CircularProgress />
            <Typography variant="body1" mt={2}>
              Fetching weather data...
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Weather Card */}
        <Box mb={4}>
          <AnimatePresence>
            {weatherInfo?.city ? (
              <motion.div
                key="weather-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <WeatherCard info={weatherInfo} />
              </motion.div>
            ) : (
              !loading && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ textAlign: 'center', fontSize: '1.2rem', color: '#888' }}
                >
                  ⛅ Type a city name to see the magic unfold!
                </motion.div>
              )
            )}
          </AnimatePresence>
        </Box>

        {/* Forecast */}
        {forecastData.length > 0 && (
          <Box mb={5}>
            <Forecast data={forecastData} />
          </Box>
        )}

        {/* Recent Searches */}
        <Box>
          <RecentSearches onSelectCity={fetchAllWeatherData} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
