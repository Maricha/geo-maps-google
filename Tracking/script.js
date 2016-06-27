let trackId = null;
let locations = [];
function displayLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let googleLoc = new google.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude);
  locations.push(googleLoc);

  const pLocation = document.getElementById("location");
  pLocation.innerHTML += latitude + ", " + longitude + "<br>";
}

function displayError(error) {
  const errors = ["Unknown error", "Permission denied by user",
  "Position not available", "Timeout error"];
  const message = errors[error.code];
  console.warn("Error in getting location: " + message, error.message);
}

function computeTotalDistance() {
  let totalDistance = 0;

  if(locations.length > 1) {
    for (let i = 0; i < locations.length; i++) {
      totalDistance += google.maps.geometry.spherical.computeDistanceBetween(
        locations[i-1], locations[i]);
    }
  }

  return totalDistance;
}

function trackMe() {
  trackId = navigator.geolocation.watchPosition(displayLocation, displayError);
}

function clearTracking() {
  if(trackId) {
    navigator.geolocation.clearWatch(trackId);
    trackId = null;
  }
}

window.onload = () => {
  let pDistance = document.getElementById("distance");
  let trackButton = document.querySelector("button");
  trackButton.onclick = (e) => {
    e.preventDefault();
    if(trackButton.innerHTML === "Start") {
      trackButton.innerHTML = "Stop";
      trackMe();
    }
    else {
      trackButton.innerHTML = "Start";
      clearTracking();
      let d = computeTotalDistance();
      if (d > 0 ) {
        d = Math.round(d*1000)/1000;
        pDistance.innerHTML = "Total distance traveled: " + d + "km";
      } else {
        pDistance.innerHTML = "you didn't travel anywhare at all.";
      }
    }
  }
}
