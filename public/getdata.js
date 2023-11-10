const socket = new WebSocket("ws://localhost:9000");
socket.onopen = () => {
  console.log("WebSocket connection established.");
  start();
};

socket.onmessage = (event) => {
  const message = event.data;
  console.log("Received message:", message);
  let msg = JSON.parse(message);
  switch (msg.type) {
    case "access_token":
      localStorage.setItem("access_token", msg.data);
      var region = $("#region").val();
      var marketplaceValue = $("#marketplace").val();
      var data = {
        region: region,
        marketplace: marketplaceValue,
        access_token: localStorage.getItem("access_token"),
        msg: "update_report",
      };
      socket.send(JSON.stringify(data));
      break;
    case "report_updated":
        getListingsItem();
        break;
    default:
      console.log("Received unknown message");
  }
};

socket.onclose = () => {
  console.log("WebSocket connection closed.");
};

function start()
{
    var region = $("#region").val();
    var marketplaceValue = $("#marketplace").val();
    var data = {
      region: region,
      marketplace: marketplaceValue,
      msg: "get_access_token",
    };
    socket.send(JSON.stringify(data));
}