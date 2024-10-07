export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidHJpbmd1eWVuMTk0IiwiYSI6ImNtMWFyOWdoeDFpcnAybHF4eTE3OHhjb3oifQ.2YMMOgYpXIRL7zGyhlqi1A';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/tringuyen194/cm1asixh602e501pb4p39gpld',
    scrollZoom: false,
  });
  const bounds = new mapboxgl.LngLatBounds();

  locations.map((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';
    new mapboxgl.Marker(el).setLngLat(loc.coordinates).addTo(map);
    new mapboxgl.Popup()
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 150,
      bottom: 100,
      left: 100,
      right: 100,
    },
  });
};
