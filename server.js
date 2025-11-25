import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import { getCache, setCache } from "./cache.js";

dotenv.config();
const app = express();
app.use(cors());

const NASA_URL = "https://api.nasa.gov/planetary/apod";
const API_KEY = process.env.NASA_API_KEY;

// ---- REST ENDPOINTS -----

// 1. Today's APOD
app.get("/api/apod/today", async (req, res) => {
    const key = "today";

    const cached = getCache(key);
    if (cached) return res.json(cached);

    try {
        const { data } = await axios.get(NASA_URL, {
            params: { api_key: API_KEY }
        });
        setCache(key, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch APOD" });
    }
});

// 2. APOD by date
app.get("/api/apod/:date", async (req, res) => {
    const { date } = req.params;

    const cached = getCache(date);
    if (cached) return res.json(cached);

    try {
        const { data } = await axios.get(NASA_URL, {
            params: { api_key: API_KEY, date }
        });
        setCache(date, data);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: "Invalid date or fetch failed" });
    }
});

// 3. Recent Images (last 10 days)
app.get("/api/apod/recent", async (req, res) => {
    const key = "recent";

    const cached = getCache(key);
    if (cached) return res.json(cached);

    try {
        const today = new Date();
        const tenDaysAgo = new Date(today);
        tenDaysAgo.setDate(today.getDate() - 10);

        const { data } = await axios.get(NASA_URL, {
            params: {
                api_key: API_KEY,
                start_date: tenDaysAgo.toISOString().split("T")[0],
                end_date: today.toISOString().split("T")[0]
            }
        });

        setCache(key, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch recent APODs" });
    }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
