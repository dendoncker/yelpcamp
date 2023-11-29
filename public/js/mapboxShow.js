mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h5>${campground.title}</h5><p>${campground.city}, ${campground.state}</p>`);

const marker = new mapboxgl.Marker({ "color": "#4CAF50" })
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl());