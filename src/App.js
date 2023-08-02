import * as React from "react";
import { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";
import "./App.css";
function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("users"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [star, setStar] = useState(1);
  const [desc, setDesc] = useState(null);
  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
  };
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newPlace);
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      lng: newPlace.lng,
    };
    try {
      const res = await axios.post("/api/pin/", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDblClick = (e) => {
    const { lat, lng } = e.lngLat;
    setNewPlace({
      lat,
      lng,
    });
  };
  const handleLogout = () => {
    myStorage.removeItem("users");
    setCurrentUser(null);
  };
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/api/pin/");
        console.log(res.data);
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);
  return (
    <div className="App">
      <Map
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 4,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken="pk.eyJ1IjoieWFzaDU1NSIsImEiOiJjbDdsdW1mam0wOGkzM3dwOWE5MHdtdTA5In0.hdnvnbP9qJ84-aPa9xcrWw"
        onDblClick={handleDblClick}
      >

        { pins.length>0 && pins.map((p) => {
          return (
            <>
              <Marker
                position="absolute"
                longitude={p.long || p.lng}
                latitude={p.lat}
                anchor="center"
              >
                <i
                  class="fa-solid fa-location-pin"
                  style={{
                    fontSize: "35px ",
                    color: p.username === currentUser ? "teal" : "white",
                    cursor: "pointer",
                  }}
                  onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                ></i>
              </Marker>
              {p._id === currentPlaceId && (
                <Popup
                  longitude={p.long}
                  latitude={p.lat}
                  closeButton={true}
                  closeOnClick={false}
                  anchor="right"
                  onClose={() => setCurrentPlaceId(null)}
                >
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{p.title}</h4>
                    <label>Review</label>
                    <p>{p.desc}</p>
                    <label>Rating</label>
                    <div>
                      {Array(p.rating).fill(
                        <i className="fa-solid fa-star"></i>
                      )}
                    </div>
                    <label>Information</label>
                    <span className="username">
                      Created by <b>{p.username}</b>
                    </span>
                    <span className="date">{format(p.createdAt)}</span>
                  </div>
                </Popup>
              )}
            </>
          );
        })}
        {newPlace && (
          <Popup
            longitude={newPlace.lng}
            latitude={newPlace.lat}
            closeButton={true}
            closeOnClick={false}
            anchor="right"
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                ></input>
                <label>Review</label>
                <textarea
                  placeholder="Give Reviews"
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                ></textarea>
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
        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUser}
            myStorage={myStorage}
          />
        )}
      </Map>
    </div>
  );
}
export default App;
