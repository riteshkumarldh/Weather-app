const wrapper = document.querySelector("[data-wrapper]");
const searchBox = document.querySelector("[data-search]");
const locationButton = document.querySelector("[data-button]");
const apiStatus = document.querySelector("[data-status]");
// const weather = document.querySelector("[data-weather]");

const API_KEY = "4f46732062f42662447d5770c3ef673e";
let url = "";

// fetching weather on basis of Enter input 
searchBox.addEventListener("keyup", (e) => {
    if(e.key === "Enter") {
        
        // storing enter city
        let city = e.target.value;
        if(city == "") return;

        // showing the current status is it fetched or fetching
        apiStatus.classList.add("pending");
        apiStatus.textContent = "Wait Fetching data";

        // calling function on basis of enter city
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        fetchData(url);
    }
});

// fetching weather on basis of current location
locationButton.addEventListener("click" , () => {
    // if browser supporting geolocation then do further action otherwise show alert
    if(navigator.geolocation) {
        // if user current location fetched then onSuccess callback run otherwise onError callback run
        navigator.geolocation.getCurrentPosition(onSuccess , onError);

    } else {
        alert("Your browser not suppoert geoloaction Api");
    }
});

// definition of onSuccess callback function
function onSuccess(position) {
    const {latitude , longitude} = position.coords;

    if(apiStatus.classList.contains("error")) {
        apiStatus.classList.replace("error" , "pending");
    } else {
        apiStatus.classList.add("pending");
    }
    apiStatus.textContent = "Wait Fetching data";

    // console.log(latitude , longitude);
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
    fetchData(url);
};

// definition of onError callback function
function onError (err) {
    if(err.code == "1") {
        apiStatus.classList.add("error");
        apiStatus.textContent = `${err.message}`;
    };
}

// fetching data using fetch method
async function fetchData(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        showWeatherDetails(data);
    } catch (err) {
        apiStatus.classList.add("error");
        apiStatus.textContent = err;
    }

    // promise method of fetching data
    // fetch(url).then((res) => {
    //     return res.json();
    // }).then((data)=> {
    //     showWeatherDetails(data);
    // }).catch((err) => {
    //     console.log(err);
    // });
}

function showWeatherDetails (data) {
    searchBox.value = "";

    if(data.cod == "404") {
        if(apiStatus.classList.contains("pending")) {
            apiStatus.classList.replace("pending" , "error");
        } else {
            apiStatus.classList.add("error");
        };
        apiStatus.textContent = "Please Enter valid city name";

    } else {
        apiStatus.classList.remove("pending" , "error");
        wrapper.classList.add("active");
        document.querySelector("[data-back]").addEventListener("click" , () => {
            wrapper.classList.remove("active");
        });

        updatingData(data);
    } 
}

function updatingData(data) {
    // console.log(data);

    const {name , main : { feels_like, humidity , temp, }, sys: {country} , weather } = data;
    const { description , id , icon} = weather[0];
    // console.log(name , feels_like, humidity, temp, country, description, id , icon) ;

    // upding all the data dynamically based on fetched data
    if(id == 800) { document.querySelector("[data-weather-icon]").src = `http://openweathermap.org/img/wn/${icon}@2x.png`; }
    else if(id >= 801 && id <= 804) { document.querySelector("[data-weather-icon]").src = "./icons/cloud.svg"; }
    else if(id >= 701 && id <= 781) { document.querySelector("[data-weather-icon]").src = "./icons/cloud.svg"; }
    else if(id >= 600 && id <= 622) { document.querySelector("[data-weather-icon]").src = "./icons/snow.svg"; }
    else if(id >= 500 && id <= 531) { document.querySelector("[data-weather-icon]").src = "./icons/rain.svg"; }
    else if(id >= 300 && id <= 321) { document.querySelector("[data-weather-icon]").src = "./icons/haze.svg"; }
    else if(id >= 200 && id <= 232) { document.querySelector("[data-weather-icon]").src = "./icons/storm.svg"; }
    else { `http://openweathermap.org/img/wn/${icon}@2x.png`; };

    document.querySelector("[data-temp]").textContent = `${temp.toFixed()}°C`;
    document.querySelector("[data-weather-status]").textContent = `${description}`;
    document.querySelector("[data-location]").innerHTML = `<i class="fa fa-location-arrow" aria-hidden="true"></i> ${name}, ${country}`;
    document.querySelector("[data-feels-like]").innerHTML = `<p class="deg">${feels_like.toFixed()}°C</p> <p>Feels like</p>`;
    document.querySelector("[data-humidity]").innerHTML = `<p class="deg">${humidity}%</p> <p>Humidity</p>`;
}