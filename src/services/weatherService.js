const API_KEY = "382185ad0a2038b9e17b16b33c4f63d8";

// 🌤️ Fetch current weather
export const fetchWeatherInfo = async (city) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  const json = await res.json();

  if (json.cod !== 200) {
    throw new Error("City not found");
  }

  return {
    city: json.name,
    Temp: json.main.temp ?? 'N/A',
    Min_Temp: json.main.temp_min ?? 'N/A',
    Max_Temp: json.main.temp_max ?? 'N/A',
    Feels_Like: json.main.feels_like ?? 'N/A',
    Humidity: json.main.humidity ?? 'N/A',
    Weather: json.weather?.[0]?.description ?? 'N/A',
  };
};

// 📅 Fetch 5-day forecast
export const fetchForecast = async (city) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );
  const data = await res.json();

  if (!res.ok || data.cod !== "200") {
    throw new Error(data.message || "Forecast API failed");
  }

  // Group forecast by date
  const grouped = {};
  data.list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(entry);
  });

  // Process only 5 days
  const dailySummaries = Object.entries(grouped)
    .slice(0, 5)
    .map(([date, entries]) => {
      const temps = entries.map(e => e.main.temp);
      const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
      const icon = entries[0].weather[0].icon;
      const desc = entries[0].weather[0].description;

      return { date, avgTemp, icon, desc };
    });

  return dailySummaries;
};
