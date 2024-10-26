import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl'; 
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { TiLocation } from "react-icons/ti"; 
import { GetAllPinRoute } from './ApiRoutes';
import { FaStar } from "react-icons/fa";
import styled from 'styled-components';
import { format } from 'timeago.js';

const Map1 = () => {
    const currentuser = "User2";
    const [pins, setPins] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null); 
    const [newplace, setNewplace] = useState(null);
    const [viewport, setViewport] = useState({
        latitude: 20.5937, 
        longitude: 78.9629,
        zoom: 4,
    });

    const handleAddClick = (e) => {
        console.log(e);
        
        // Check if e.lngLat is valid and an instance of an object
        if (e.lngLat && typeof e.lngLat === 'object') {
            const lng = e.lngLat.lng; // Access lng property
            const lat = e.lngLat.lat; // Access lat property
            setNewplace({
                lat: lat,
                long: lng
            });
        } else {
            console.error("Invalid lngLat format:", e.lngLat);
        }
    }
    

    useEffect(() => {
        const getPins = async () => {
            try {
                const response = await axios.get(GetAllPinRoute);
                console.log(response.data); 
                setPins(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        getPins();
    }, []);

    return (
        <Map
            mapboxAccessToken="pk.eyJ1Ijoia2FydW5hc3JlZSIsImEiOiJjbTJrMmZuYzIwYXdkMnFyMDBjYmlsMGpzIn0.6uXxxe27ekWu5ELVnFRKpA"
            initialViewState={viewport}
            style={{ width: '100%', height: '100vh' }}
            mapStyle="mapbox://styles/karunasree/clzd0uevh00ad01prav0f6grl"
            onViewportChange={setViewport}
            onDblClick={handleAddClick}
        >
            {pins.map(pin => (
                pin.long != null && pin.lat != null ? (
                    <Marker 
                        key={pin._id} 
                        longitude={pin.long} 
                        latitude={pin.lat} 
                        anchor="bottom"
                        offsetLeft={-20}
                        offsetTop={-10}
                    >
                        <TiLocation 
                            style={{ 
                                color: pin.username === currentuser ? 'green' : 'red', // Change color based on username
                                fontSize: `${viewport.zoom * 7}px` 
                            }} 
                            onClick={() => setCurrentPlaceId(pin._id)} 
                        />
                    </Marker>
                ) : null
            ))}

            {currentPlaceId && 
                (() => {
                    const currentPin = pins.find(pin => pin._id === currentPlaceId);
                    if (currentPin) {
                        return (
                            <Popup 
                                longitude={currentPin.long} 
                                latitude={currentPin.lat}
                                anchor="left"
                                closeButton={true}
                                closeOnClick={false}
                                onClose={() => setCurrentPlaceId(null)}
                            >
                                <CardContainer>
                                    <label>Place</label>
                                    <h4>{currentPin.title}</h4>
                                    <label>Review</label>
                                    <p className='desc'>{currentPin.desc}</p>
                                    <label>Rating</label>
                                    <div className='stars'>
                                        {[...Array(currentPin.rating)].map((_, i) => (
                                            <FaStar key={i} />
                                        ))}
                                    </div>
                                    <label>Information:</label>
                                    <span className='username'>Created by <b>{currentPin.username}</b></span>
                                    <span className='date'>{format(currentPin.createdAt)}</span>
                                </CardContainer>
                            </Popup>
                        );
                    }
                    return null; 
                })()
            }

            {/* Render the new place popup independently */}
            {newplace && (
                <Popup 
                    longitude={newplace.long} 
                    latitude={newplace.lat}
                    anchor="left"
                    closeButton={true}
                    closeOnClick={false}
                    onClose={() => setNewplace(null)} // Close the popup when needed
                >
                hello
                </Popup>
            )}
        </Map>
    );
};

const CardContainer = styled.div`
    width: 250px;
    height: auto; 
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    label {
        width: max-content;
        color: blue;
        font-size: 13px;
        border-bottom: 1px solid blue;
        margin: 3px 0;
    }

    .desc {
        font-size: 14px;
    }

    .stars {
        color: gold;
    }

    .username {
        font-size: 14px;
    }

    .date {
        font-size: 12px;
    }
`;

export default Map1;
