import express from "express";
import morgan from "morgan";
import v1Routes from "./api/v1/routes";

const app = express();

app.use(express.json());
app.use(morgan("combined"));

app.use("/api/v1", v1Routes);

export default app;
