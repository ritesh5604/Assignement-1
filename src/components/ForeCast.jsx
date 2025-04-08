import './Forecast.css';

export default function ForeCast({ data }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="forecast">
            <h3>5-Day Forecast</h3>
            <div className="forecast-container">
                {data.map((day, index) => (
                    <div key={index} className="forecast-card">
                        <h4>{day.date}</h4>
                        <img
                            src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                            alt={day.desc}
                        />
                        <p>{day.avgTemp}°C</p>
                        <small>{day.desc}</small>
                    </div>
                ))}
            </div>
        </div>
    );
}
