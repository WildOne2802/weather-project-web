async function getLocalWeather(city) {
    let result
    await fetch(`http://api.weatherapi.com/v1/current.json?key=87fce2d80f614e05b08155651211803&q=${city}`).then(r => result = r.json())
    return result
}

function directionDefiner(direction) {
    switch (direction) {
        case 'S':
            return 'South'
            break
        case 'N':
            return 'North'
            break
        case 'W':
            return 'West'
            break
        case 'E':
            return 'East'
            break
        case 'SW':
            return 'South-West'
            break
        case 'SE':
            return 'South-East'
            break
        case 'NW':
            return 'North-West'
            break
        case 'NE':
            return 'North-East'
            break
        case 'SSW':
            return 'South-South-West'
            break
        case 'SSE':
            return 'South-South-East'
            break
        case 'NNW':
            return 'North-North-West'
            break
        case 'NNE':
            return 'North-North-East'
            break
        case 'WNW':
            return 'West-North-West'
            break
        case 'WSW':
            return 'West-South-West'
            break
        case 'ENE':
            return 'East-North-East'
            break
        case 'ESE':
            return 'East-South-East'
            break
        default:
            return 'NaN'
    }
}

async function getCities() {
    getLocalWeather('Saint-Petersburg').then(response => {
        document.getElementById('mainTitle').innerText = 'Saint-Petersburg'
        document.getElementById('mainTemperature').innerText = response.current.temp_c + '°C'
        document.getElementById('mainWind').innerText = (Number(response.current.wind_kph) * 1000 / 3600).toFixed(2) + ' m/s, ' + directionDefiner(response.current.wind_dir)
        document.getElementById('mainCloudiness').innerText = response.current.cloud + '%'
        document.getElementById('mainPressure').innerText = (Number(response.current.pressure_mb) / 10) + ' kPa'
        document.getElementById('mainHumidity').innerText = response.current.humidity + '%'
        document.getElementById('mainCoordinates').innerText = '[' + response.location.lat + ', ' + response.location.lon + ']'
        document.getElementById('mainWeatherIcon').src = response.current.condition.icon
    })
    let cities = ['Moscow', 'London', 'Nalchik', 'Stockholm', 'Helsinki', 'Oslo']

    cities.map((x, index) => {
        getLocalWeather(x).then(response => {
            document.getElementById(`Title${index}`).innerText = x
            document.getElementById(`Temperature${index}`).innerText = response.current.temp_c + '°C'
            document.getElementById(`Wind${index}`).innerText = (Number(response.current.wind_kph) * 1000 / 3600).toFixed(2) + ' m/s, ' + directionDefiner(response.current.wind_dir)
            document.getElementById(`Cloudiness${index}`).innerText = response.current.cloud + '%'
            document.getElementById(`Pressure${index}`).innerText = (Number(response.current.pressure_mb) / 10) + ' kPa'
            document.getElementById(`Humidity${index}`).innerText = response.current.humidity + '%'
            document.getElementById(`Coordinates${index}`).innerText = '[' + response.location.lat + ', ' + response.location.lon + ']'
            document.getElementById(`miniIcon${index}`).src = response.current.condition.icon
        })
    })


    // function success(position) {
    //    console.log(position)
    // }
    //
    // function error() {
    //     console.log('error')
    // }
    // navigator.geolocation.getCurrentPosition(success, error)
}

getCities()
