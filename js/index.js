


// ======== HELPER FUNCTIONS ========

// A function named $ that takes a CSS selector and returns the first Element it finds from the document
const $ = selector => {
  return document.querySelector(selector);
};

// ======== WEATHER FUNCTIONS ========


const weatherByIp = (lat, lon) => {
  
  fetch(`https://cors-anywhere.herokuapp.com/http://ip-api.com/json`).then(response => {
    // TODO: If the response fails, do something!

    response.json().then(data => {
      console.log(data); // Dump the results
      weatherByGeo(data.lat, data.lon);
    })
  })
}

// Search for weather by city name
const weatherByGeo = (lat, lon) => {
  // Put up a loading screen before we go get the data
  $(`#loading`).classList.add(`show`);

  const key = `6dec5fb891e6e243c9d8c20351998e67`;
  const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${key}&lat=${lat}&lon=${lon}`;

  goGetWeather(url);
}


const goGetWeather = (url) => {

  fetch(url).then(response => {
    // TODO: If the response fails, do something!

    response.json().then(data => {
      console.log(data); // Dump the results

      // Remove the "loading..." screen
      $(`#loading`).classList.remove(`show`);

      // Destructure (store as const variables) some useful variables:
      //    sunrise, sunset, temp, weather, name, dt ("datetime" it was last updated)
      const {
        sys: { sunrise, sunset },
        main: { temp },
        weather,
        name,
        dt
      } = data;
      //    width, height (of the browser's viewport)
      const { width, height } = window;

      $(`#temp`).innerHTML = `${temp}&deg;C`;

      const iconImg = `http://openweathermap.org/img/wn/${
        weather[0].icon
      }@2x.png`;
      $(`#icon`).innerHTML = `<img src="${iconImg}" alt="${weather[0].main}">`;

      // $(`body`).style.backgroundImage = `url("https://source.unsplash.com/random/${width}×${height}/?${name},${weather[0].main},skyline")`
      $(
        `.panel-header`
      ).style.backgroundImage = `url("https://source.unsplash.com/random/1600x900/?${name},${
        weather[0].main
      },skyline")`;

      const max = 40;
      t = temp; //t = 40;
      const sat = Math.floor(Math.abs(t) / max * 100);
      const lit = Math.floor(Math.abs(Math.abs(t) - 70));
      const hue = (t >= 0) ? 10 : 210;
      $(`body`).style.background = `
        linear-gradient(120deg, hsla(${hue},${sat}%,40%,1) 0%, hsla(${hue},20%,${lit}%,1) 100%)`;

      // console.log(`linear-gradient(120deg, hsla(${hue},${sat}%,40%,1) 0%, hsla(${hue},${sat}%,${lit}%,1) 100%)`);
      
      // This assumes local time!
      const sunriseTime = new Date(sunrise * 1000);
      const sunsetTime = new Date(sunset * 1000);
      console.log(
        sunriseTime.toLocaleTimeString(`en-CA`),
        sunsetTime.toLocaleTimeString(`en-CA`)
      );

      // Calculate daylight measurements in milliseconds, seconds, minutes, hours
      const sunlightMs = sunsetTime - sunriseTime;
      const sunlightS = sunlightMs / 1000;
      const sunlightM = sunlightS / 60;
      const sunlightH = sunlightM / 60;

      //if (dt < sunset) tense = `will be`
      //else tense = `was`

      $(`#sun`).innerHTML = `There ${
        dt < sunset ? `will be` : `was`
      } <strong>${sunlightH.toFixed(2)} hours</strong> of sunlight today.`;

      const shortestDay = new Date(`December 21, 2019`).getTime();
      const longestDay = new Date(`June 21, 2019`).getTime();
      const shortLongDiff = longestDay - shortestDay;
      console.log(shortLongDiff);

    });
  });
};




// ======== GEOLOCATION FUNCTIONS ========

window.onload = () => {
  if ("geolocation" in navigator) {

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        // good
        weatherByGeo(latitude, longitude); // Go!
      },
      ({ code, message }) => {
        // bad
        console.warn(`Woops! Error ${code}: ${message}`);
        weatherByIp();
      }
    );

  } else {

    console.warn(`Woops! Geolocation is not enabled on your browser.`);
    weatherByIp();

  }
};