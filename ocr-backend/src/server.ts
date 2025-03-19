import express from "express";
import cors from "cors"
import { configDotenv } from "dotenv"
import extractRouter from "./extract.routes";
const app = express();
app.use(cors())
configDotenv()

app.use("/", extractRouter)

app.listen(process.env.PORT || 4000, () => console.log("Server running on port 4000"));

