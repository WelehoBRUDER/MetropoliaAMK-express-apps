import express from "express";
import cors from "cors";
import {notFoundHandler, errorHandler} from "./middlewares.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/public", express.static("public"));

// Default for all routes not handled by routers above
app.use(notFoundHandler);
// Add error handler middleware as the last middleware in the chain
app.use(errorHandler);

export default app;
