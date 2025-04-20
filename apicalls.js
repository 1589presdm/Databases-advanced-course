import express from "express";
import { verifyToken } from "./utils.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import index from "./api/index.js";
import data from "./api/data.js";
import login from "./api/login.js";

const swaggerDocument = YAML.load("./openapi/api.yaml");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/", index);

app.use("/api/data", verifyToken, data);

app.use("/login", login);

export default app;
