import app from "./app.js";
import Router from "express";
import catRouter from "./api/routes/cat-router.js";
import userRouter from "./api/routes/user-router.js";
import authRouter from "./api/routes/auth-router.js";
import {notFoundHandler, errorHandler} from "./middlewares.js";

const router = Router();
const url = "/api/v1";

// bind base url for all cat routes to catRouter
router.use(`${url}/cats`, catRouter);
router.use(`${url}/users`, userRouter);
router.use(`${url}/auth`, authRouter);

app.use(router);

// Default for all routes not handled by routers above
app.use(notFoundHandler);
// Add error handler middleware as the last middleware in the chain
app.use(errorHandler);

const hostname = "127.0.0.1";
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
