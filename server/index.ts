import dotenv from "dotenv";
import { connectDB } from "./src/utils/db.js";
dotenv.config();

import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Salvo server is running on port ${PORT}`);
});