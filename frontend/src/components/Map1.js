import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { TiLocation } from "react-icons/ti";
import { AddPinRoute, GetAllPinRoute } from './ApiRoutes';
import { FaStar } from "react-icons/fa";
import styled from 'styled-components';
import { format } from 'timeago.js';
import { useNavigate } from 'react-router-dom';

const Map1 = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [pins, setPins] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [viewport, setViewport] = useState({
        latitude: 20.5937,
        longitude: 78.9629,
        zoom: 4,
    });
    const [newPlaceData, setNewPlaceData] = useState({ title: '', desc: '', rating: 1 });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    useEffect(() => {
        const getPins = async () => {
            setLoading(true);
            try {
                const response = await axios.get(GetAllPinRoute);
                setPins(response.data);
            } catch (err) {
                console.error(err);
                setErrorMessage('Failed to load pins. Please refresh.');
            } finally {
                setLoading(false);
            }
        };
        getPins();
    }, []);

    const handleMarkerClick = (id, lat, long) => {
        setCurrentPlaceId(id);
        setViewport((prev) => ({
            ...prev,
            latitude: lat,
            longitude: long,
        }));
    };

    const handleAddClick = (e) => {
        const { lng, lat } = e.lngLat;
        setNewPlace({ lat, long: lng });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPlaceData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddPin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newPin = {
                username: currentUser?.username,
                ...newPlace,
                ...newPlaceData,
            };
            const response = await axios.post(AddPinRoute, newPin);
            setPins((prevPins) => [...prevPins, response.data]);
            setNewPlace(null);
            setNewPlaceData({ title: '', desc: '', rating: 1 });
            setViewport((prev) => ({
                ...prev,
                latitude: newPlace.lat,
                longitude: newPlace.long,
            }));
        } catch (err) {
            console.error(err);
            setErrorMessage('Failed to add pin. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderCurrentPinPopup = () => {
        const currentPin = pins.find(pin => pin._id === currentPlaceId);
        return (
            currentPin && (
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
            )
        );
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
    };

    return (
        <Map
            mapboxAccessToken="pk.eyJ1Ijoia2FydW5hc3JlZSIsImEiOiJjbTJrMmZuYzIwYXdkMnFyMDBjYmlsMGpzIn0.6uXxxe27ekWu5ELVnFRKpA"
            initialViewState={viewport}
            style={{ width: '100%', height: '100vh' }}
            mapStyle="mapbox://styles/karunasree/clzd16e5900aa01plf4qohcsl"
            onMove={(evt) => setViewport(evt.viewState)}
            onDblClick={handleAddClick}
            transitionDuration="200"
        >
            {loading && <LoadingMessage>Loading...</LoadingMessage>}
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

            {pins.map((pin) =>
                pin.long && pin.lat ? (
                    <Marker
                        key={pin._id}
                        longitude={pin.long}
                        latitude={pin.lat}
                        anchor="bottom"
                    >
                        <TiLocation
                            style={{
                                color: pin.username === currentUser?.username ? 'green' : 'red',
                                fontSize: `${viewport.zoom * 7}px`
                            }}
                            onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
                        />
                    </Marker>
                ) : null
            )}
            {currentPlaceId && renderCurrentPinPopup()}
            {newPlace && (
                <Popup
                    longitude={newPlace.long}
                    latitude={newPlace.lat}
                    anchor="left"
                    closeButton={true}
                    closeOnClick={false}
                    onClose={() => setNewPlace(null)}
                >
                    <FormContainer onSubmit={handleAddPin}>
                        <label>Title</label>
                        <input
                            name="title"
                            placeholder="Enter the title"
                            onChange={handleInputChange}
                            value={newPlaceData.title}
                            required
                        />
                        <label>Review</label>
                        <textarea
                            name="desc"
                            placeholder="Say something about this place"
                            onChange={handleInputChange}
                            value={newPlaceData.desc}
                            required
                        />
                        <label>Rating</label>
                        <select
                            name="rating"
                            onChange={handleInputChange}
                            value={newPlaceData.rating}
                        >
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                        <button className='submitbutton' type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Pin'}
                        </button>
                    </FormContainer>
                </Popup>
            )}

            <ButtonContainer>
                {currentUser ? (
                    <button className="button logout" onClick={handleLogout}>Logout</button>
                ) : (
                    <div className="buttons">
                        <button className="button login" onClick={handleLoginClick}>Login</button>
                        <button className="button register">Register</button>
                    </div>
                )}
            </ButtonContainer>
        </Map>
    );
};

// Styled Components
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

const FormContainer = styled.form`
    width: 250px;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    input, textarea, select {
        margin-bottom: 10px;
        padding: 5px;
        font-size: 14px;
    }

    input::placeholder, textarea::placeholder {
        font-size: 12px;
        color: rgb(199, 198, 198);
    }

    .submitbutton {
        padding: 5px;
        font-size: 14px;
        color: white;
        background-color: red;
        border: none;
        cursor: pointer;
    }

    .submitbutton:hover {
        background-color: green;
    }
`;

const ButtonContainer = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 10px; 

    .button {
        padding: 8px 12px;
        color: white;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        white-space: nowrap; 
    }

    .button:hover {
        background-color: green;
    }

    .logout {
        background-color: red;
    }

    .login {
        background-color: teal;
    }

    .register {
        background-color: slateblue;
    }

    .buttons {
        display: flex;
        gap: 10px;
    }
`;

const LoadingMessage = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    color: blue;
`;

const ErrorMessage = styled.div`
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    color: red;
`;

export default Map1;
