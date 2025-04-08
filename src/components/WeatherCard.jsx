import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box
} from '@mui/material';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { motion } from 'framer-motion';
import './info.css';

const weatherAssets = {
  default: 'https://images.unsplash.com/photo-1561553873-e8491a564fd0?q=80&w=1894&auto=format&fit=crop',
  rain: 'https://images.unsplash.com/photo-1501691223387-dd0500403074?q=80&w=1854&auto=format&fit=crop',
  summer: 'https://images.unsplash.com/photo-1447601932606-2b63e2e64331?q=80&w=1958&auto=format&fit=crop',
  winter: 'https://media.istockphoto.com/id/1071240754/photo/hiker-man-adventure-and-freedom-concept-at-snowy-mountain-view-of-leh-ladakh-district-norther.jpg?s=1024x1024&w=is&k=20&c=0jMzhMK9pTe6rY3ZX2-lLTNwUnJQrSGvWecYz6CTJOY='
};

const getWeatherImage = ({ Humidity, Temp }) => {
  if (Humidity > 80) return weatherAssets.rain;
  if (Temp > 20) return weatherAssets.summer;
  return weatherAssets.winter;
};

const getWeatherIcon = ({ Humidity, Temp }) => {
  if (Humidity > 80) return <ThunderstormIcon fontSize="large" />;
  if (Temp > 20) return <WbSunnyIcon fontSize="large" />;
  return <AcUnitIcon fontSize="large" />;
};

const WeatherDetail = ({ label, value, unit = '' }) => (
  <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
    <strong>{label}:</strong> {value !== undefined ? `${value}${unit}` : 'N/A'}
  </Typography>
);

export default function WeatherCard({ info = {} }) {
  const {
    city,
    Temp,
    Humidity,
    Max_Temp,
    Min_Temp,
    Weather,
    Feels_Like
  } = info;

  return (
    <motion.div
      className="infobox"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
    >
      <Card
        sx={{
          width: '80%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          borderRadius: 4,
          boxShadow: 4,
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: { xs: '100%', md: '50%' }, height: 250 }}
          image={getWeatherImage(info)}
          alt="Weather Visual"
        />
        <CardContent
          sx={{
            flex: '1 1 auto',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {city || 'City N/A'} {getWeatherIcon(info)}
          </Typography>

          <WeatherDetail label="Temperature" value={Temp} unit="°C" />
          <WeatherDetail label="Feels Like" value={Feels_Like} unit="°C" />
          <WeatherDetail label="Max Temp" value={Max_Temp} unit="°C" />
          <WeatherDetail label="Min Temp" value={Min_Temp} unit="°C" />
          <WeatherDetail label="Humidity" value={Humidity} unit="%" />
          <WeatherDetail label="Condition" value={Weather} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
