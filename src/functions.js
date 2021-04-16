function textParser(response) {
    let result = {};

    result.name = response.name;
    result.temperature = (Math.ceil(Number(response.main.temp))) + " °C";
    result.wind = (response.wind.speed.toFixed(2)) + ' m/s, ' + response.wind.deg;
    result.clouds = response.clouds.all + '%';
    result.pressure = (Number(response.main.pressure) / 10) + ' kPa';
    result.humidity = response.main.humidity + '%';
    result.coordinates = '[' + response.coord.lat + ', ' + response.coord.lon + ']';
    result.imageURL = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;

    return result;
}
