import express, { Request, Response } from "express";
import authRoutes from "./routes/authRouter";
import connectDb from "./db/db";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import shopRoutes from "./routes/createShop"
import faqRoutes from "./routes/faqRouter"
// Load environment variables
dotenv.config();

// Connect to database
connectDb();

const app = express();

// Middleware (Order Matters!)
app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // ✅ Parse URL-encoded data
app.use(cookieParser()); // 🔥 Ensure this is before routes
app.use(
    cors({
        origin: "http://localhost:3000", // 🔥 Change this to your frontend URL
        credentials: true, // ✅ Correct key name
    })
);

// Routes
app.use("/api", authRoutes);
app.use("/api",shopRoutes)
app.use("/api",faqRoutes)
app.get("/", (rq: Request, rs: Response) => {
    rs.send("Hare Krishna");
});

const port = process.env.PORT || 5000; // Set default port if missing
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
