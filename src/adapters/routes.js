import axios from "axios";

export async function updateDeviceStatus(device_id, lat, long, is_stolen) {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/devices/${device_id}/update`,
      {
        lat: lat,
        long: long,
        is_stolen: is_stolen,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating device status:", error);
    throw error;
  }
}
