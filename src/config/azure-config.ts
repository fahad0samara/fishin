const {BlobServiceClient} = require("@azure/storage-blob");
require("dotenv").config();
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const containerNameProduct = "fashion-app";
const containerNameUser = "fashion-app-user";

const containerClientProduct =blobServiceClient.getContainerClient(containerNameProduct);
const containerClientUser = blobServiceClient.getContainerClient(containerNameUser);

export { containerClientProduct, containerClientUser };
  

    

  

    








