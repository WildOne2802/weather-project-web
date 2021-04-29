async function submitCity() {
    let city = document.getElementById("townInput").value;

    if (city) {
        getWeatherForCity(city).then(response => {
                if (response !== null) {
                    if (document.getElementById(response.name + "-city")) {
                        alert("City is already added.")
                    } else {
                        addCityToDatabase(response.name).then(response => {
                            if (response) {
                                document.getElementById("townInput").value = null;
                                getCities();
                            } else {
                                alert("[submitCity addCityToDatabase] error.");
                            }
                        });
                    }
                } else {
                    alert("[submitCity] No matching location found.");
                }
            }
        );
    }
}

function deleteCityCard(name) {
    // document.getElementById(name + "-city").remove();
    // removeCityFromLocalStorage(name);
    removeCityFromDatabase(name).then(response => {
        if (response) {
            document.getElementById(name + "-city").remove();
        } else {
            alert("[deleteCityCard removeCityFromDatabase] error.");
        }
    });
}

function fillerForMain(data) {
    document.getElementById('mainTitle').innerText = data.name;
    document.getElementById('mainTemperature').innerText = data.temperature;
    document.getElementById('mainWind').innerText = data.wind;
    document.getElementById('mainCloudiness').innerText = data.clouds;
    document.getElementById('mainPressure').innerText = data.pressure;
    document.getElementById('mainHumidity').innerText = data.humidity;
    document.getElementById('mainCoordinates').innerText = data.coordinates;
    document.getElementById('mainWeatherIcon').src = data.imageURL;
}
