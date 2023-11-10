require("dotenv").config({
  path: `./.env`,
});
const WebSocket = require("ws");
const SellingPartner = require("amazon-sp-api");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Custom-header"
  );
  // in case we need to use our custom created header in application
  res.header("Access-Control-Expose-Headers", "X-Custom-header");
  next();
});
app.use(express.static("public"));
app.use("/", require("./controller"));

// app.use(passport.session());

app.listen(process.env.PORT, () => {
  console.log(`server running at port ${process.env.PORT}`);
  let url = new URL("https://www.google.com/get?a='i'&b='d'");
  const moment = require("moment");
  console.log(moment().format("YYYYMMDD"));
});

const wss = new WebSocket.Server({ port: 9000 });

wss.on("connection", (ws) => {
  console.log("WebSocket connection established.");

  ws.on("message", (message) => {
    //let data = JSON.parse(message);
    msg_string = message.toString();
    data = JSON.parse(msg_string);
    switch (data.msg) {
      case "get_access_token":
        getAccessToken(data, ws);
        break;
      case "update_report":
        updateReportFile(data, ws)
          .then(() => {
            let res = { type: "report_updated", data: "success" };
            ws.send(JSON.stringify(res));
          })
          .catch((err) => ws.send(err));
        break;
      default:
        console.log("Received unknown message");
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
});

async function getAccessToken(data, ws) {
  const spClient = new SellingPartner({
    region: data.region,
    refresh_token: process.env.REFRESH_TOKEN,
    options: {
      auto_request_tokens: false,
    },
  });
  await spClient.refreshAccessToken();
  let access_token = spClient.access_token;
  let res = { type: "access_token", data: access_token };
  ws.send(JSON.stringify(res));
}
async function updateReportFile(data, ws) {
  let access_token = data.access_token;
  let region = data.region;
  const spClient = new SellingPartner({
    region: region,
    refresh_token: process.env.REFRESH_TOKEN,
    access_token: access_token,
  });
  let rlt = await spClient.downloadReport({
    body: {
      reportType: "GET_FLAT_FILE_OPEN_LISTINGS_DATA",
      marketplaceIds: [data.marketplace],
    },
    version: "2021-06-30",
    interval: 8000,
    download: {
      json: true,
      file: "public/assets/reports/report.json",
    },
  });
}
