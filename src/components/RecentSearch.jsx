import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';

export default function RecentSearches({ onSelectCity }) {
  const [recentCities, setRecentCities] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recentCities')) || [];
    setRecentCities(stored);
  }, []);

  const handleCityClick = (city) => {
    if (onSelectCity) onSelectCity(city);
  };

  return (
    <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recent Searches
      </Typography>

      {recentCities.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No recent searches.
        </Typography>
      ) : (
        <List disablePadding>
          {recentCities.map((city, index) => (
            <Box key={city}>
              <ListItemButton onClick={() => handleCityClick(city)}>
                <ListItemText primary={city} />
              </ListItemButton>
              {index < recentCities.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}
    </Paper>
  );
}
