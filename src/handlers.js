function currentLocationGetter() {
    return new Promise((resolve, reject) => {
            console.log("currentLocationGetter check")
            geolocation.getCurrentPosition(
                ({coords: {latitude, longitude}}) => {
                    console.log("[getCurrentPosition] check")
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
    return await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPEN_WEATHER_API_KEY}&units=metric`).then(r => r.json());
    // return await fetch(`http://localhost:3000/weather/city?name=${city}`).then(r => r.json());
}

async function getWeatherWithCoordinates({latitude, longitude}) {
    return await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_API_KEY}&units=metric`).then(r => r.json());
    // return await fetch(`http://localhost:3000/weather/coordinates?lat=${latitude}&lon=${longitude}`).then(r => r.json());
}
