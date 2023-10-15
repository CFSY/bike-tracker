import React, { useState, useEffect, useRef } from "react";
import Geolocation from "@react-native-community/geolocation";
import { updateDeviceStatus } from "../adapters/routes";

function Tracker({ data }) {
  const [armed, setArmed] = useState(false);
  const [theft, setTheft] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [accelerationX, setAccelerationX] = useState(0);
  const [accelerationY, setAccelerationY] = useState(0);
  const [accelerationZ, setAccelerationZ] = useState(0);
  const [acceleration, setAcceleration] = useState(0);
  const [spoofing, setSpoofing] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (theft) {
        if (spoofing) {
          setLatitude((prev) => prev + 0.0001);
        }
        try {
          console.log("updating device status");
          await updateDeviceStatus(data.id, latitude, longitude, theft);
        } catch (error) {
          console.error("Failed to update device status:", error);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [theft, latitude, longitude, spoofing]);

  let accelerationThreshold = 15;

  function toggleArm() {
    if (armed && theft) setTheft(!theft);
    setArmed(!armed);
    setSpoofing(false);
    console.log(armed, theft);
  }

  function detectJerk(event) {
    if (!armedRef.current) return false;

    const a = event.acceleration;

    setAccelerationX(a.x);
    setAccelerationY(a.y);
    setAccelerationZ(a.z);

    let accelerationMagnitude = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    setAcceleration(accelerationMagnitude);

    if (accelerationMagnitude > accelerationThreshold) {
      setTheft(true);
      return true;
    } else {
      return false;
    }
  }

  const armedRef = useRef(armed);
  useEffect(() => {
    armedRef.current = armed;
  }, [armed]);

  useEffect(() => {
    // Only set up the event listener if `armed` is true
    if (armed) {
      if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", detectJerk, true);
      } else {
        console.log("DeviceMotionEvent is not supported");
      }
    }

    // Clean up the event listener when the component unmounts or when `armed` changes
    return () => {
      if (window.DeviceMotionEvent) {
        window.removeEventListener("devicemotion", detectJerk, true);
      }
    };
  }, [armed]);

  useEffect(() => {
    let watcher = null;
    if (theft) {
      watcher = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (!spoofing) {
            setLatitude(latitude);
            setLongitude(longitude);
            console.log("Update Real GPS:", latitude, longitude);
          } else {
            console.log("Ignore Real GPS");
          }
        },
        (error) => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
          distanceFilter: 10,
        }
      );
    }
    return () => {
      if (watcher) {
        Geolocation.clearWatch(watcher);
      }
    };
  }, [theft, spoofing]);

  return (
    <div className="flex flex-col items-center justify-between bg-white rounded shadow-md p-3 h-[500px] w-[90vw]">
      <div className="items-left w-[100%]">
        <h1 className="text-2xl font-bold mb-3">Device ID: {data.id}</h1>
        <h1 className="text-2xl font-bold mb-3">
          Status:{" "}
          <span className={armed ? "text-green-500" : "text-red-500"}>
            {armed ? "Armed" : "Disarmed"}
          </span>
        </h1>
        <h1 className="text-2xl font-bold mb-3">
          Theft Detected:{" "}
          <span className={theft ? "text-red-500" : "text-green-500"}>
            {theft ? "Yes" : "No"}
          </span>
        </h1>
        {armed && (
          <div>
            <h2 className="text-xl mb-3">
              Acceleration X: {Number(accelerationX).toFixed(2)}
            </h2>
            <h2 className="text-xl mb-3">
              Acceleration Y: {Number(accelerationY).toFixed(2)}
            </h2>
            <h2 className="text-xl mb-3">
              Acceleration Z: {Number(accelerationZ).toFixed(2)}
            </h2>
            <h2 className="text-xl mb-3">
              Acceleration: {Number(acceleration).toFixed(2)}
            </h2>
          </div>
        )}
        {theft && (
          <div>
            <h1 className="text-xl mb-3">Latitude: {latitude}</h1>
            <h1 className="text-xl mb-3">Longitude: {longitude}</h1>
          </div>
        )}
      </div>
      {theft && armed && !spoofing && (
        <button
          onClick={() => {
            setSpoofing(true);
          }}
          className="mb-2 text-white font-bold py-2 px-4 rounded w-32 bg-blue-500 active:bg-blue-700"
        >
          Spoof
        </button>
      )}
      <button
        onClick={toggleArm}
        className={`mb-2 text-white font-bold py-2 px-4 rounded w-32 ${
          armed
            ? "bg-red-500 active:bg-red-700"
            : "bg-green-500 active:bg-green-700"
        }`}
      >
        {armed ? "Disarm" : "Arm"}
      </button>
    </div>
  );
}

export default Tracker;
