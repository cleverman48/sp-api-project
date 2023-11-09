require("dotenv").config({
  path: `./.env`,
});
const axios = require('axios');
const {getInventorySummaries} = require('./api');

async function getAccessToken(req, res) {
  const url = 'https://api.amazon.com/auth/o2/token';
  clientId = process.env.CLIENT_ID;
  clientSecret = process.env.CLIENT_SECRET;
  refreshToken = process.env.REFRESH_TOKEN;

  const postData = {
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken
  };
  
  await axios.post(url, postData)
    .then((response) => {
      getInventorySummaries( response.data.access_token , req, res);
    })
    .catch((error) => {
      console.error('Error:', error);
      res.send("error");
    });
}
module.exports = {
  getAccessToken,
};
