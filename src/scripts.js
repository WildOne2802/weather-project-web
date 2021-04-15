// template
// ; in each end line +
// Promise all
// Same cities in english and russian +
// Alert if city is already shown
// Remove logging in getWeatherForCity and getWeatherWithCoordinates +


const API_KEY = "87fce2d80f614e05b08155651211803";

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
    return await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`).then(r => r.json());
}

async function getWeatherWithCoordinates({latitude, longitude}) {
    return await fetch(`https://api.weatherapi.com/v1/current.json?key=87fce2d80f614e05b08155651211803&q=${latitude},${longitude}`).then(r => r.json());
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
        }
    } else {
        alert("City already added")
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
    getWeatherForCity(document.getElementById("townInput").value).then(response => {
        console.log("[Response] hello")
            if (!response.error && response !== null) {
                console.log("[hey] hello")
                addCityToLocalStorage(response.location.name).then(
                    () => {
                        console.log("[ADDED]")
                        document.getElementById("townInput").value = null;
                        getCities();
                    }
                )
            } else {
                console.log("[hey] not done")
                alert("No matching location found.");
            }
        }
    )
}

function deleteCityCard(name) {
    console.log(name);
    document.getElementById(name + "-city").remove();
    removeCityFromLocalStorage(name);
}

function createCard(name) {
    getWeatherForCity(name).then(response => {
            const template = `
            <div class="cardTitleBox">
                <div class="titleTemperatureWeatherBox">
                    <h3>${response.location.name}</h3>
                    <p>${response.current.temp_c} °C</p>
                    <img src="${response.current.condition.icon}"/>
                </div>
                <div class="closeButtonBox">
                    <button id="${response.location.name}" class="roundButton roundButtonTextCentralize" onclick="deleteCityCard(this.id)">✕</button>
                </div>
            </div>
            <ul class="cardDescription">
                <li>
                    <p>Ветер</p>
                    <p>${(Number(response.current.wind_kph) * 1000 / 3600).toFixed(2) + ' m/s, ' + directionDefiner(response.current.wind_dir)}</p>
                </li>
                <li>
                    <p>Облачность</p>
                    <p>${response.current.cloud + '%'}</p>
                </li>
                <li>
                    <p>Давление</p>
                    <p>${(Number(response.current.pressure_mb) / 10) + ' kPa'}</p>
                </li>
                <li>
                    <p>Влажность</p>
                    <p>${response.current.humidity + '%'}</p>
                </li>
                <li>
                    <p>Координаты</p>
                    <p>${'[' + response.location.lat + ', ' + response.location.lon + ']'}</p>
                </li>
            </ul>
        </div>`;
            let card = document.createElement("div");
            card.innerHTML = template;
            card.classList.add("weatherCard");
            card.id = response.location.name + "-city";
            console.log(document.getElementById("favourite"));
            weatherFavourite.appendChild(card);
        }
    )
}

async function getCities() {
    let cities = await loadFromLocalStorage();
    // console.log(cities);
    await currentLocationWeather()
    if (cities) {
        cities.map((x) => {
                if (!document.getElementById(x + "-city")) {
                    createCard(x);
                }
            }
        )
    }
}

async function currentLocationWeather() {
    try {
        await currentLocationGetter().then(response => {
                getWeatherWithCoordinates(response).then(response => {
                    document.getElementById('mainTitle').innerText = response.location.name;
                    document.getElementById('mainTemperature').innerText = response.current.temp_c + '°C';
                    document.getElementById('mainWind').innerText = (Number(response.current.wind_kph) * 1000 / 3600).toFixed(2) + ' m/s, ' + directionDefiner(response.current.wind_dir);
                    document.getElementById('mainCloudiness').innerText = response.current.cloud + '%';
                    document.getElementById('mainPressure').innerText = (Number(response.current.pressure_mb) / 10) + ' kPa';
                    document.getElementById('mainHumidity').innerText = response.current.humidity + '%';
                    document.getElementById('mainCoordinates').innerText = '[' + response.location.lat + ', ' + response.location.lon + ']';
                    document.getElementById('mainWeatherIcon').src = response.current.condition.icon;
                })

            }
        )
    } catch (e) {
        console.log(e)
        getWeatherForCity(defaultCity).then(response => {
            document.getElementById('mainTitle').innerText = response.location.name
            document.getElementById('mainTemperature').innerText = response.current.temp_c + '°C';
            document.getElementById('mainWind').innerText = (Number(response.current.wind_kph) * 1000 / 3600).toFixed(2) + ' m/s, ' + directionDefiner(response.current.wind_dir);
            document.getElementById('mainCloudiness').innerText = response.current.cloud + '%';
            document.getElementById('mainPressure').innerText = (Number(response.current.pressure_mb) / 10) + ' kPa';
            document.getElementById('mainHumidity').innerText = response.current.humidity + '%';
            document.getElementById('mainCoordinates').innerText = '[' + response.location.lat + ', ' + response.location.lon + ']';
            document.getElementById('mainWeatherIcon').src = response.current.condition.icon;
        })
    }

}

function locationRefreshListener() {
    console.log("Refresh");
    let elems = document.getElementsByClassName("loader");
    document.getElementById("mainDiv").style.display = "none";
    document.getElementById("mainDescription").style.display = "none";
    for (let i = 0; i < elems.length; i++) {
        elems[i].style.display = "block";
    }
    currentLocationWeather().then(() => {
        for (let i = 0; i < elems.length; i++) {
            elems[i].style.display = "none";
        }
        document.getElementById("mainDiv").style.display = "block";
        document.getElementById("mainDescription").style.display = "flex";
    })
}

function refresh() {
    window.dispatchEvent(new Event("refreshEvent"));
}

getCities();
