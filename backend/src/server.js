import express from "express";
import path, { dirname} from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todosRoutes from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 8383;

//Get the file path from the Url of the current module
const __filename = fileURLToPath(import.meta.url);

//Get the directory name
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../../frontend") ));

app.use("/api/auth", authRoutes);
app.use("/api/todos", authMiddleware, todosRoutes);

//Serving up the HTML files from ${__dirname}/index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/index.html"));
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
