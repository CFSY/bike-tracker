import React, { useState, useEffect } from "react";
import Geolocation from "@react-native-community/geolocation";

function Tracker({ data }) {
  const [armed, setArmed] = useState(false);
  const [theft, setTheft] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Accelerometer data
  let previousAcceleration = { x: 0, y: 0, z: 0 };
  let jerkThreshold = 5;  // Set your own threshold for what you consider a jerk

  // Detects a significant jerk in the device
  function detectJerk(event) {
    console.log(event)
    // const a = event.accelerationIncludingGravity;
    
    // // Calculate the magnitude of the acceleration vector
    // let accelerationMagnitude = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    
    // // Calculate the difference in acceleration
    // let deltaAcceleration = Math.abs(accelerationMagnitude - previousAcceleration);
    
    // // Update previous acceleration
    // previousAcceleration = accelerationMagnitude;
    
    // // If the change in acceleration is greater than the threshold, return true
    // if (deltaAcceleration > jerkThreshold) {
    //   return true;
    // } else {
    //   return false;
    // }
  }

  useEffect(() => {
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', detectJerk, true);
    } else {
      console.log("DeviceMotionEvent is not supported");
    }

    if (armed) {
      const intervalId = setInterval(() => {
        if (detectJerk()) {
          setTheft(true);
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [armed]);

  useEffect(() => {
    if (theft) {
      const intervalId = setInterval(() => {
        Geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          console.log(latitude, longitude);
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [theft]);

  return (
    <div className="flex flex-col items-center justify-between bg-white rounded shadow-md p-3 h-[50vh] w-[90vw]">
      <div className="items-left w-[100%]">
        <h1 className="text-2xl font-bold mb-3">Device ID: {data.id}</h1>
        <h1 className="text-2xl font-bold mb-3">
          Status: {armed ? "Armed" : "Disarmed"}
        </h1>
        {theft && (
          <div>
            <h1 className="text-xl mb-3">Latitude: {latitude}</h1>
            <h1 className="text-xl mb-3">Longitude: {longitude}</h1>
          </div>
        )}
      </div>
      <button
        onClick={() => setArmed(!armed)}
        className={`mt-5 text-white font-bold py-2 px-4 rounded w-32 ${
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
