import * as Bluetooth from "react-bluetooth";

function BTSetup() {
  async function handleConnect() {
    try {
      const result = await Bluetooth.requestDeviceAsync();

      if (result.type === "cancel") {
        console.log("User cancelled the request");
        return;
      }

      const device = result.device;
      console.log(`Connected to device ${device.name}`);

      device.addEventListener("gattserverdisconnected", handleDisconnect);
    } catch ({ message, code }) {
      console.error("Error:", message, code);
    }
  }

  function handleDisconnect() {
    console.log("Device disconnected");
    // Implement additional logic here
  }

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
    >
      Connect to Bluetooth device
    </button>
  );
}

export default BTSetup;
