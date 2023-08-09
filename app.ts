import express, {Express, Request, Response, Application} from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import routerAuth from "./src/router/Auth";
import routerCategories from "./src/router/Categories";
import routerColorsSizes from "./src/router/Colors_Sizes";
import routerProducts from "./src/router/product";




//For env File
dotenv.config()
const app: Express = express();

const mongodbUri = process.env.MONGODB_URI;
if (!mongodbUri) {
  throw new Error("MONGODB_URI environment variable is not set.");
}

mongoose
  .connect(mongodbUri)
  .then(() => console.log("MongoDB connected"))
  .catch(error => console.error(error));

app.set("port", process.env.PORT || 3000);

app.use(cors());



// middleware for parsing application/json and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
  next();
});

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.use("/api/auth", routerAuth); 
app.use("/categories", routerCategories);
app.use("/colorsSizes", routerColorsSizes);
app.use("/products", routerProducts);


app.listen(app.get("port"), () => {
  // middleware for logging
  console.log(`Server is listening on port ${app.get("port")}`);
});
