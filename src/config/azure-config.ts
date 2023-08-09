const {BlobServiceClient} = require("@azure/storage-blob");
require("dotenv").config();
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const containerName = "fashion-app";

const containerClient = blobServiceClient.getContainerClient(containerName);

const createContainerIfNotExists = async () => {
  const containerExists = await containerClient.exists();
  if (!containerExists) {
    await containerClient.create();
    console.log(`The container "${containerName}" has been created`);
  }
};

export {createContainerIfNotExists, containerClient};
