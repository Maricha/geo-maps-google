let map;
let markers = [];
let infoWindow;


function displayLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let pLocation = document.getElementById("location");
  pLocation.innerHTML = latitude + ", " + longitude;

  showMap(position.coords);
}

function showMap(coords) {
  let googleLatLong = new google.maps.LatLng(coords.latitude, coords.longitude);

  let mapOptions = {
    zoom: 11,
    center: googleLatLong,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  const mapDiv = document.getElementById("map");
  let map = new google.maps.Map(mapDiv, mapOptions);
  infoWindow = new google.maps.InfoWindow();

  google.maps.event.addListener(map, "click", (event) => {
    let latitude = event.latLng.lat();
    let longitude = event.latLng.lng();

    let pLocation = document.getElementById("location");
    pLocation.innerHTML = latitude + ", " + longitude;
    map.panTo(event.latLng);

    createMarker(event.latLng);

  });

}

function createMarker(latLng) {
  markerOptions = {
    position: latLng,
    map: map,
    clickable: true
  };

  let marker = new google.maps.Marker(markerOptions);
  markers.push(marker);


  google.maps.event.addListener(marker, "click", (event) => {
      infoWindow.setContent("Location: " + event.latLng.lat().toFixed(2) +
      ", " + event.latLng.lng().toFixed(2));
      infoWindow.open(map, marker);
  });
}

function displayError(error) {
  const errors = ["unknown error", "Permission denied by user", "Position not available", "Timeout error"];
  let message = errors[error.code];
  console.warn("Error in getting your location: " + message, error.message);
}

window.onload = () => {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(displayLocation, displayError);
  } else {
    alert("Sorry you have old browser");
  }
}
