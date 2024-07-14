const apiKey = 'ab364b49f0411716c51abbfb3406bc26';
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const app = document.getElementById('app');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (!city) return;
    fetchWeather(city);
});

function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { main, weather, wind, coord } = data;
            const temperature = Math.round(main.temp - 273.15);
            const condition = weather[0].main;
            const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
            const humidity = main.humidity;
            fetchUVIndex(coord.lat, coord.lon).then(uvIndex => {
                app.innerHTML = `
                    <div class="weather-container">
                        <h1 class="weather-title">${city}</h1>
                        <div class="weather-details">
                            <p><strong>Temperature:</strong> ${temperature}°C</p>
                            <img src="${iconUrl}" alt="${condition}">
                            <p><strong>Condition:</strong> ${condition}</p>
                            <p><strong>Humidity:</strong> ${humidity}%</p>
                            <p><strong>UV Index:</strong> ${uvIndex}</p>
                        </div>
                        <h2>Weekly Forecast</h2>
                        <div id="weekly-forecast"></div>
                    </div>
                `;
                fetchWeeklyForecast(city);
            });
        })
        .catch(error => console.error('Error fetching weather:', error));
}

function fetchUVIndex(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => data.value)
        .catch(error => console.error('Error fetching UV index:', error));
}

function fetchWeeklyForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const forecastItems = data.list.filter((item, index) => index % 8 === 0).map(item => {
                const date = new Date(item.dt_txt);
                const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
                const temp = Math.round(item.main.temp - 273.15);
                const condition = item.weather[0].main;
                const iconUrl = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

                return `
                    <div class="weather-tile">
                        <p><strong>${dayOfWeek}</strong></p>
                        <img src="${iconUrl}" alt="${condition}">
                        <p>${temp}°C</p>
                        <p>${condition}</p>
                    </div>
                `;
            }).join('');

            document.getElementById('weekly-forecast').innerHTML = forecastItems;
        })
        .catch(error => console.error('Error fetching forecast:', error));
}
