
mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL
    center: festival.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
 });






const markerHeight = 50;
const markerRadius = 10;
const linearOffset = 25;
const popupOffsets = {
    'top': [0, 0],
    'top-left': [0, 0],
    'top-right': [0, 0],
    'bottom': [0, -markerHeight],
    'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'left': [markerRadius, (markerHeight - markerRadius) * -1],
    'right': [-markerRadius, (markerHeight - markerRadius) * -1]
};

new mapboxgl.Marker({
    color: '#ff0000'
}).setLngLat(festival.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: popupOffsets, className: 'my-class'})
        .setHTML(
            `<h3>${festival.title}</h3><p>${festival.location}</p>`
        )
    )
    .addTo(map);

 