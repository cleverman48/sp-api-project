const axios = require('axios');


async function getInventorySummaries (req,res) {
    const region = req.body.region;
    const marketPlace = req.body.marketplace;
    const url = getEndPoint(region);
    if(url === "error") 
    {
        result = {error:1};
        return result;
    }
    else
    {   
        var target = url + "fba/inventory/v1/summaries";
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-amz-access-token': req.body.access_token,
                },
                params: {
                    details: true,
                    granularityType: "Marketplace",
                    granularityId:marketPlace,
                    marketplaceIds:marketPlace,
                },
            };
            const response = await axios.get(target, config);
            console.log(response.data);
            res.send(response.data);

          } catch (error) {
            console.error(error);
            res.send("error investory");
        }
    } 
}
function getEndPoint(region)
{
    if(region === "na")
    {
        return "https://sellingpartnerapi-na.amazon.com/";
    }
    else if(region === "eu")
    {
        return "https://sellingpartnerapi-eu.amazon.com/";
    }
    else if(region === "fe")
    {
        return "https://sellingpartnerapi-fe.amazon.com/";
    }
    else
    {
        return "error";
    }
}
module.exports = {
    getInventorySummaries,
    getEndPoint,
};
