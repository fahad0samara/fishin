import express, {Express, Request, Response, Application} from "express";
import dotenv from "dotenv";
import cors from "cors";


//For env File
dotenv.config()
const app : Express = express();
app.set("port", process.env.PORT || 3000);
console.log(__dirname + "/public/");
app.use(express.static(__dirname + "/public/"));
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

app.listen(app.get("port"), () => {
  // middleware for logging
  console.log(`Server is listening on port ${app.get("port")}`);
});
