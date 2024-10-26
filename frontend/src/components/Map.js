import React, { useState, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import { GetAllPinRoute } from './ApiRoutes';
import { format } from 'timeago.js';
import { Popup } from 'react-map-gl';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FydW5hc3JlZSIsImEiOiJjbHpjdndvMjAwMTd3MmlvNzdwbndhbjlmIn0.Wf03dmwZd6FrI3_y1h7v9A';

const currentUser = 'User2'; // Set the current user

const Map = () => {
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [star, setStar] = useState(1);
  const mapContainerRef = React.useRef(null);
  const [popupCoordinates, setPopupCoordinates] = useState(null); // State for popup coordinates

  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPlace({ lat, long: lng });
    
    // Set popup coordinates to display "Hello"
    setPopupCoordinates({ lat, lng });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      await axios.post(`${GetAllPinRoute}`, newPin);
      setPins((prevPins) => [...prevPins, newPin]);
      setNewPlace(null); // Close the form popup after submission
    } catch (err) {
      console.error("Error adding new pin:", err);
    }
  };

  useEffect(() => {
    // Initialize the map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/karunasree/clzd0uevh00ad01prav0f6grl',
      center: [78.9629, 20.5937],
      zoom: 4,
    });

    map.doubleClickZoom.disable(); // Disable double-click zoom

    const getPins = async () => {
      try {
        const res = await axios.get(GetAllPinRoute);
        setPins(res.data);

        res.data.forEach((pin) => {
          if (pin.long && pin.lat) {
            const coordinates = [pin.long, pin.lat];
            const markerColor = pin.username === currentUser ? 'green' : 'red';

            // Create marker
            const marker = new mapboxgl.Marker({ color: markerColor })
              .setLngLat(coordinates)
              .addTo(map);

            // Create popup for the marker
            const popup = new mapboxgl.Popup({ closeOnClick: false })
              .setHTML(`
                <div class="card">
                  <label>Place:</label>
                  <h4 class="place">${pin.title}</h4>
                  <hr />
                  <label>Review:</label>
                  <p class="desc">${pin.desc}</p>
                  <hr />
                  <label>Rating:</label>
                  <div class="stars">
                    ${Array.from({ length: pin.rating }, () => '<span class="star">⭐</span>').join('')}
                  </div>
                  <hr />
                  <label>Information:</label>
                  <span class="username">Created by <b>${pin.username}</b></span>
                  <hr />
                  <span class="date">${format(pin.createdAt)}</span>
                </div>
              `);

            marker.getElement().addEventListener('click', () => {
              map.flyTo({ center: coordinates, zoom: 15, essential: true });
              popup.setLngLat(coordinates).addTo(map);
            });
          } else {
            console.error("Invalid coordinates for pin:", pin);
          }
        });
      } catch (err) {
        console.error("Error fetching pins:", err);
      }
    };

    getPins();
    map.on('dblclick', handleAddClick); // Custom double-click event handler

    return () => {
      map.off('dblclick', handleAddClick); // Clean up event listener
      map.remove(); // Cleanup on unmount
    };
  }, []);

  return (
    <MapContainer ref={mapContainerRef}>
      {newPlace && (
        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewPlace(null)}
          anchor="left"
        >
          <div>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                placeholder="Enter a title"
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>Description</label>
              <textarea
                placeholder="Say us something about this place."
                onChange={(e) => setDesc(e.target.value)}
              />
              <label>Rating</label>
              <select onChange={(e) => setStar(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button type="submit" className="submitButton">
                Add Pin
              </button>
            </form>
          </div>
        </Popup>
      )}

      {/* Display "Hello" popup when double-clicking on the map */}
      {popupCoordinates && (
        <Popup
          latitude={popupCoordinates.lat}
          longitude={popupCoordinates.lng}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setPopupCoordinates(null)} // Close the popup on close
          anchor="left"
        >
          <div>Hello</div>
        </Popup>
      )}
    </MapContainer>
  );
};

const MapContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

export default Map;
