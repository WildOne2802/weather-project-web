// template +
// ; in each end line +
// Promise all +
// Same cities in english and russian +
// Alert if city is already shown +
// Remove logging in getWeatherForCity and getWeatherWithCoordinates +
// Enter +
// Preloader +
// Split files +
// Text auto +

const LOCAL_STORAGE_KEY = "Weather-for-each-city";

let geolocation = navigator.geolocation;

const weatherFavourite = document.querySelector("#favourite");

const defaultCity = "Nalchik";

function createCard(response) {
    let template = document.getElementById('temp');
    let clone = template.content.cloneNode(true);

    let h3 = clone.querySelector("h3");
    h3.textContent = response.name;

    let pArray = clone.querySelectorAll("p");

    pArray[0].textContent = response.temperature;
    pArray[2].textContent = response.wind;
    pArray[4].textContent = response.clouds;
    pArray[6].textContent = response.pressure;
    pArray[8].textContent = response.humidity;
    pArray[10].textContent = response.coordinates;

    let img = clone.querySelector("img");
    img.src = response.imageURL;

    let button = clone.querySelector("button");
    button.id = response.name;

    let div = clone.querySelector(".weatherCard");
    div.id = response.name + "-city";

    weatherFavourite.appendChild(clone);
}

async function currentLocationWeather() {
    try {
        await currentLocationGetter().then(response => {
                getWeatherWithCoordinates(response).then(response => {
                    fillerForMain(textParser(response));
                });
            }
        );
    } catch (e) {
        console.log(e);
        getWeatherForCity(defaultCity).then(response => {
            fillerForMain(textParser(response));
        });
    }
}

async function getCities() {
    let cities = await loadFromLocalStorage();
    await currentLocationWeather();

    let template = document.getElementById('preloaderTemplate');
    let clone = template.content.cloneNode(true);
    let div = document.createElement("div");
    div.appendChild(clone);
    div.classList.add("preloader");

    let promiseArray = [];

    if (cities) {
        cities.map((x) => {
                if (!document.getElementById(x + "-city")) {
                    promiseArray.push(getWeatherForCity(x));
                    weatherFavourite.appendChild(div);
                    // console.log(div);
                }
            }
        );
    }

    Promise.all(promiseArray).then(() => {
            document.querySelectorAll(".preloader").forEach(e => e.remove());

            promiseArray.map((x) => {
                x.then(response => createCard(textParser(response)));
            });
        }
    );
}

document.getElementById("townInput").addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        submitCity();
    }
});

window.addEventListener('refreshEvent', locationRefreshListener);

function locationRefreshListener() {
    let loading = document.querySelector("#mainWeatherIcon");
    loading.src = "Dual%20Ring-1s-200px.svg";
    currentLocationWeather();
}

getCities();
