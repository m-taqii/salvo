import express from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import sendRouter from "./routes/email/send.route";
import authRouter from "./routes/auth/user.route";

const app = express();

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
  origin: function (origin, callback) {
    // Allow any localhost origin (e.g. 3000, 3001) for development
    if (!origin || origin.startsWith("http://localhost")) {
      callback(null, origin || true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", upload.single("attachment"), sendRouter);
app.use("/api/auth", authRouter);

export default app;