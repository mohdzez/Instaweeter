// 3rd party
import mongoose, { mongo } from "mongoose";
import express, { application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
// Native
import path from "path";
import { fileURLToPath } from "url";
// custom
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
const app = express();
dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// storage system
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// routes with files
app.post("/auth/register", upload.single("picture"), register);

// routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);

// database
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    app.listen(process.env.PORT, () => {
      console.log(`Server Connected: ${process.env.PORT}`);
    })
  )
  .catch((error) =>
    console.log(`Error: ${error.message}, Server Not Connected`)
  );
