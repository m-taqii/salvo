import express from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import sendRouter from "./routes/email/send.route";
import authRouter from "./routes/auth/user.route";

const app = express();

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", upload.single("attachment"), sendRouter);
app.use("/api/auth", authRouter);

export default app;