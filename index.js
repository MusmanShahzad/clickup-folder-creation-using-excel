import express from "express";
import axios from "axios";
// const axios = require("axios").default;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

app.get("/about", (req, res) => {
  res.send("This is my about route..... ");
});

app.post("/create-folders", async (req, res) => {
  const { token, folderNames, spaceId } = req.body;

  if (!token || !folderNames) {
    return res.status(400).send("Missing token or folder names");
  }

  const headers = {
    Authorization: token,
    "Content-Type": "application/json",
  };

  try {
    for (const folderName of folderNames) {
      // Create a folder
      let folderResponse = await axios.post(
        `https://api.clickup.com/api/v2/space/${spaceId}/folder`,
        {
          name: folderName,
        },
        { headers }
      );

      let folderId = folderResponse.data.id;

      // Create a list inside the folder
      await axios.post(
        `https://api.clickup.com/api/v2/folder/${folderId}/list`,
        {
          name: "Legacy",
        },
        { headers }
      );
    }

    res.send("Folders and lists created successfully.");
  } catch (error) {
    console.error("Error creating folders/lists:", error);
    res.status(500).send("Error creating folders and lists");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Export the Express API
export default app;
