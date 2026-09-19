    
    const map = new mapboxgl.Map({
        accessToken: mapToken,
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 10// starting zoom
    });

    console.log(listing.geometry.coordinates);
    // Create a default Marker and add it to the map.
    const marker1 = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(listing.geometry.coordinates)   //listing.geometry.coordinates
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h4>${listing.location}</h4><h6>Exact location provided after booking</h6>`))
        
        .addTo(map);