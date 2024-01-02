import express from "express";
import { config } from "dotenv";
import imageRouter from "./routes/image.js"; // Adjusted import
import healthRoutes from "./routes/health.js";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import Keycloak from "keycloak-connect";

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

config();

const kcConfig = {
  clientId: process.env.KEYCLOAK_RESOURCE,
  cors: false,
  bearerOnly: true,
  serverUrl: process.env.KEYCLOAK_AUTH_SERVER,
  realm: process.env.KEYCLOAK_REALM,
};

const memorystore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memorystore }, kcConfig);

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const app = express();

app.use(session({
  secret: process.env.KEYCLOAK_SECRET,
  resave: false,
  saveUninitialized: true,
  store: memorystore,
}));
app.set('trust proxy', true);
app.use(keycloak.middleware());

app.use(express.json());
app.use(cors());

// Pass the Keycloak instance to the image router
app.use("/image", imageRouter(keycloak));
app.use("/", healthRoutes);
app.use("/uploads", express.static("uploads"));

export default app;

