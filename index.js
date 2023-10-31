import axios from "axios";

export default async function (req, res) {
  if (req.method === "POST") {
    const { token, folderNames, spaceId } = req.body;

    if (!token || !folderNames || !spaceId) {
      return res.status(400).send("Missing token, folder names, or space ID");
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
          { name: folderName },
          { headers }
        );

        let folderId = folderResponse.data.id;

        // Create a list inside the folder
        await axios.post(
          `https://api.clickup.com/api/v2/folder/${folderId}/list`,
          { name: "Legacy" },
          { headers }
        );
      }

      res.send("Folders and lists created successfully.");
    } catch (error) {
      console.error("Error creating folders/lists:", error);
      res.status(500).send("Error creating folders and lists");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
