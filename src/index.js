import app from "./app.js";
import Router from "express";
import catRouter from "./api/routes/cat-router.js";
import userRouter from "./api/routes/user-router.js";

const router = Router();

// bind base url for all cat routes to catRouter
router.use("/cats", catRouter);
router.use("/users", userRouter);

app.use(router);

const hostname = "127.0.0.1";
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
