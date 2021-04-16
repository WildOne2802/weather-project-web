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
