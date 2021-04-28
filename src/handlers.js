const herokuURL = "https://weather-project-backend.herokuapp.com/weather";

function handleError(response) {
    if (!response.ok) {
        throw new Error(response.statusText);
        return null;
    }
    return response;
}

function currentLocationGetter() {
    return new Promise((resolve, reject) => {
            console.log("currentLocationGetter check");
            geolocation.getCurrentPosition(
                ({coords: {latitude, longitude}}) => {
                    console.log("[getCurrentPosition] check");
                    resolve({latitude, longitude});
                },
                (error) => {
                    console.log(error);
                    reject(error);
                }, {enableHighAccuracy: true}
            );
        }
    );
}

async function getWeatherForCity(city) {
    // return await fetch(`${openWeatherURL}?q=${city}&appid=${OPEN_WEATHER_API_KEY}&units=metric`).then(r => r.json());
    // return await fetch(`http://localhost:3000/weather/city?name=${city}`).then(handleError).then(r => (r === null) ? r : r.json()).catch((e) => alert("City not found"));
    return await fetch(`${herokuURL}/city?name=${city}`).then(handleError).then(r => (r === null) ? r : r.json()).catch((e) => alert("City not found"));
}

async function getWeatherWithCoordinates({latitude, longitude}) {
    // return await fetch(`${openWeatherURL}?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_API_KEY}&units=metric`).then(r => r.json());
    // return await fetch(`http://localhost:3000/weather/coordinates?lat=${latitude}&lon=${longitude}`).then(async (r) => {
    //     return await r.json();
    // });
    return await fetch(`${herokuURL}/coordinates?lat=${latitude}&lon=${longitude}`).then(r => r.json());
}

async function getFavourites() {
    return await fetch('http://localhost:3000/weather/favourites').then(async (r) => {
        return await r.json();
    });
    //return await fetch(`${herokuURL}/favourites`).then(r => r.json());
}

async function addCityToDatabase(name) {
    // return await fetch(`http://localhost:3000/weather/addCity?name=${name}`, {method: "POST"});
    return await fetch(`${herokuURL}/addCity?name=${name}`, {method: "POST"});
}

async function removeCityFromDatabase(name) {
    // return await fetch(`http://localhost:3000/weather/removeCity?name=${name}`, {method: "DELETE"});
    return await fetch(`${herokuURL}/removeCity?name=${name}`, {method: "DELETE"});
}
