const express = require("express");
const route = express.Router({ strict: true });
const fs = require("fs");
const path = require("path");
const SellingPartner = require("amazon-sp-api");

route.get("/", async (req, res) => {
  try {
    fs.readFile("./index.html", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        res.send(data);
      }
    });
  } catch (err) {
    console.log("err", err);
    res.status(err.status ? err.status : InternalServerError.status).send(err);
  }
});

route.post("/get_access_key", async (req, res) => {
    //const access_token = await getAccessToken(req, res);
    const spClient = new SellingPartner({
        region: req.body.region,
        refresh_token: process.env.REFRESH_TOKEN,
        options: {
            auto_request_tokens: false
        }
    });
    await spClient.refreshAccessToken();
    let access_token = spClient.access_token;    
    res.send(access_token);
});
route.post("/get_listings_item", async (req, res) => {
    let access_token = req.body.access_token;
    let region = req.body.region;
    const spClient = new SellingPartner({
        region: region,
        refresh_token: process.env.REFRESH_TOKEN,
        access_token: access_token
    });
    let listing_item = await spClient.callAPI({
        operation: "getListingsItem",
        endpoint: "listingsItems",
        query: {
            marketplaceIds: req.body.marketplace,
            issueLocale: "ja_JP",
            includedData: "summaries,attributes,issues,offers,fulfillmentAvailability,procurement",
        },
        path: {
            sellerId: process.env.SELLER_ID,
            sku: "0A-ZTEV-ATST",
        },       
    });
    let asin = listing_item.summaries[0].asin;
   
    let catalog_item = await spClient.callAPI({
        operation: "getCatalogItem",
        endpoint: "catalogItems",
        path: {
            asin: asin
        },
        query: {
            marketplaceIds: req.body.marketplace,
            includedData: "attributes,dimensions,identifiers,images,productTypes,relationships,salesRanks,summaries",
            locale: "ja_JP"
        },
        options: {
            version: "2022-04-01"
        }  
    });
    res.send({listing_item:listing_item, catalog_item:catalog_item});
});
route.post("/get_inventory_summary", async (req, res) => {
    let access_token = req.body.access_token;

    const spClient = new SellingPartner({
        region: req.body.region,
        refresh_token: process.env.REFRESH_TOKEN,
        access_token: access_token
    });
    let rlt = await spClient.callAPI({
        operation: "getInventorySummaries",
        endpoint: "fbaInventory",
        query: {
          details: true,
          granularityType: "Marketplace",
          granularityId: req.body.marketplace,
          marketplaceIds: req.body.marketplace,
          sellerSku: "0A-ZTEV-ATST",
        }
    });
    res.send(rlt);
});
route.post("/get_inventory_summary_next", async (req, res) => {
    //getInventorySummaries(req, res);
    let access_token = req.body.access_token;
    let nextToken = req.body.next_token;
    const spClient = new SellingPartner({
        region: req.body.region,
        refresh_token: process.env.REFRESH_TOKEN,
        access_token: access_token
    });
    let rlt = await spClient.callAPI({
        operation: "getInventorySummaries",
        endpoint: "fbaInventory",
        query: {
          details: true,
          granularityType: "Marketplace",
          granularityId: req.body.marketplace,
          marketplaceIds: req.body.marketplace,
          sellerSku: "0A-ZTEV-ATST",
          nextToken:nextToken,
        }
    });
    res.send(rlt);
});

module.exports = route;
