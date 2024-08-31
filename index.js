// server/index.js
const express = require("express");
const { WebPubSubServiceClient } = require("@azure/web-pubsub-express");
const { CosmosClient } = require("@azure/cosmos");

const app = express();
const port = process.env.PORT || 4000;

const webPubSubService = new WebPubSubServiceClient("https://chat-app-evp.webpubsub.azure.com", "chat");
const cosmosClient = new CosmosClient("https://chat-app-db.documents.azure.com:443/");

app.get("/", (req, res) => {
  res.send("Chat Server is Running");
});

app.post("/messages", async (req, res) => {
  const message = req.body.message;
  await webPubSubService.sendToAll(message);
  await cosmosClient.database("chatDB").container("messages").items.create({ message });
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
