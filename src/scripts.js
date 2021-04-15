// template +
// ; in each end line +
// Promise all +
// Same cities in english and russian +
// Alert if city is already shown +
// Remove logging in getWeatherForCity and getWeatherWithCoordinates +

const OPEN_WEATHER_API_KEY = "5a64a59089eaa18ea98d99d393e609f6";

const LOCAL_STORAGE_KEY = "Weather-for-each-city";

let geolocation = navigator.geolocation;

const weatherFavourite = document.querySelector("#favourite");

const defaultCity = "Nalchik";

window.addEventListener('refreshEvent', locationRefreshListener);

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

async function loadFromLocalStorage() {
    let cities = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cities) {
        return JSON.parse(cities);
    } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
    }
}

async function addCityToLocalStorage(name) {
    let currentState = await loadFromLocalStorage();
    if (currentState) {
        if (!currentState.includes(name)) {
            currentState.push(name);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentState));
        } else {
            alert("City is already added");
        }
    } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentState));
    }
}

async function removeCityFromLocalStorage(name) {
    let currentState = await loadFromLocalStorage();
    if (currentState.includes(name)) {
        currentState = currentState.filter((item) => item !== name);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentState));
    }
}

async function submitCity() {
    let city = document.getElementById("townInput").value;
    if (city) {
        getWeatherForCity(city).then(response => {
                if (!response.error && response !== null) {
                    addCityToLocalStorage(response.name).then(
                        () => {
                            document.getElementById("townInput").value = null;
                            getCities();
                        }
                    )
                } else {
                    alert("No matching location found.");
                }
            }
        )
    }
}

function deleteCityCard(name) {
    // console.log(name)
    document.getElementById(name + "-city").remove();
    removeCityFromLocalStorage(name);
}

function createCard(response) {
    let template = document.getElementById('temp');
    let clone = template.content.cloneNode(true);
    let h3 = clone.querySelector("h3");
    h3.textContent = response.name;
    let pArray = clone.querySelectorAll("p");

    pArray[0].textContent = (Math.ceil(Number(response.main.temp))) + " °C";
    pArray[2].textContent = (response.wind.speed.toFixed(2)) + ' m/s, ' + response.wind.deg;
    pArray[4].textContent = response.clouds.all + '%';
    pArray[6].textContent = (Number(response.main.pressure) / 10) + ' kPa';
    pArray[8].textContent = response.main.humidity + '%';
    pArray[10].textContent = '[' + response.coord.lat + ', ' + response.coord.lon + ']';

    let img = clone.querySelector("img");
    img.src = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;

    let button = clone.querySelector("button");
    button.id = response.name;

    // let card = document.createElement("div");
    // card.innerHTML = template;

    let div = clone.querySelector(".weatherCard");
    div.id = response.name + "-city";


    // let result = document.createElement("div");
    // result.appendChild(clone);
    // console.log(clone)

    // console.log(document.getElementById("favourite"))
    weatherFavourite.appendChild(clone);
}

async function getCities() {
    let cities = await loadFromLocalStorage();
    await currentLocationWeather();

    let promiseArray = [];

    if (cities) {
        cities.map((x) => {
                if (!document.getElementById(x + "-city")) {
                    promiseArray.push(getWeatherForCity(x));
                }
            }
        );
    }
    Promise.all(promiseArray).then(() => {
            promiseArray.map((x) => {
                x.then(response => createCard(response));
            });
        }
    )
}

function fillerForMain(data) {
    document.getElementById('mainTitle').innerText = data.name;
    document.getElementById('mainTemperature').innerText = (Math.ceil(Number(data.main.temp))) + '°C';
    document.getElementById('mainWind').innerText = (data.wind.speed.toFixed(2)) + ' m/s, ' + data.wind.deg;
    document.getElementById('mainCloudiness').innerText = data.clouds.all + '%';
    document.getElementById('mainPressure').innerText = (Number(data.main.pressure) / 10) + ' kPa';
    document.getElementById('mainHumidity').innerText = data.main.humidity + '%';
    document.getElementById('mainCoordinates').innerText = '[' + data.coord.lat + ', ' + data.coord.lon + ']';
    document.getElementById('mainWeatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

async function currentLocationWeather() {
    try {
        await currentLocationGetter().then(response => {
                getWeatherWithCoordinates(response).then(response => {
                    fillerForMain(response);
                });
            }
        )
    } catch (e) {
        console.log(e);
        getWeatherForCity(defaultCity).then(response => {
            fillerForMain(response);
        })
    }

}

function locationRefreshListener() {
    // console.log("Refresh");
    // let elems = document.getElementsByClassName("loader");
    // document.getElementById("mainDiv").style.display = "none";
    // document.getElementById("mainDescription").style.display = "none";
    // for (let i = 0; i < elems.length; i++) {
    //     elems[i].style.display = "block";
    // }
    // currentLocationWeather().then(() => {
    //     for (let i = 0; i < elems.length; i++) {
    //         elems[i].style.display = "none";
    //     }
    //     document.getElementById("mainDiv").style.display = "block";
    //     document.getElementById("mainDescription").style.display = "flex";
    // })
    let loading = document.querySelector("#mainWeatherIcon");
    loading.src = "Dual%20Ring-1s-200px.svg";
    currentLocationWeather();
}

function refresh() {
    window.dispatchEvent(new Event("refreshEvent"));
}

getCities();
