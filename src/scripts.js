const API_KEY = "87fce2d80f614e05b08155651211803"

let geolocation = navigator.geolocation;

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

function currentLocationGetter() {
    return new Promise((resolve, reject) => {
            geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
                    resolve({latitude, longitude});
                },
                (error) => {
                    console.log(error);
                    reject(error);
                }, {enableHighAccuracy: true}
            )
        }
    )
}

async function getWeatherForCity(city) {
    let result
    await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`).then(r => result = r.json())
    return result
}

async function getWeatherWithCoordinates({latitude, longitude}) {
    console.log(latitude, longitude)
    let result
    try {
        await fetch(`https://api.weatherapi.com/v1/current.json?key=87fce2d80f614e05b08155651211803&q=${latitude},${longitude}`).then(r => result = r.json())
    } catch (e) {
        console.log("[getWeatherWithCoordinates] Cannot get weather for location")
    }
    return result
}

async function getCities() {
    await currentLocationGetter().then(response => {
            getWeatherWithCoordinates(response).then(response => {
                console.log(response)
                document.getElementById('mainTitle').innerText = response.location.name
                document.getElementById('mainTemperature').innerText = response.current.temp_c + '°C'
                document.getElementById('mainWind').innerText = (Number(response.current.wind_kph) * 1000 / 3600).toFixed(2) + ' m/s, ' + directionDefiner(response.current.wind_dir)
                document.getElementById('mainCloudiness').innerText = response.current.cloud + '%'
                document.getElementById('mainPressure').innerText = (Number(response.current.pressure_mb) / 10) + ' kPa'
                document.getElementById('mainHumidity').innerText = response.current.humidity + '%'
                document.getElementById('mainCoordinates').innerText = '[' + response.location.lat + ', ' + response.location.lon + ']'
                document.getElementById('mainWeatherIcon').src = response.current.condition.icon
            }).catch(e => console.log(e))
        }
    )
    let cities = ['Moscow', 'London', 'Нальчик', 'Stockholm', 'Helsinki', 'Oslo']

    cities.map((x, index) => {
        getWeatherForCity(x).then(response => {
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
}

function refetch(){
    getCities()
}

getCities()
