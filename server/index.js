import express from "express";
import cors from "cors";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const DATA_DIR = path.resolve(__dirname, "data");
const CSV_PATH = path.resolve(DATA_DIR, "watched.csv");

const CSV_COLUMNS = [
  "imdbID",
  "title",
  "year",
  "poster",
  "imdbRating",
  "runtime",
  "userRating",
];

async function ensureCsvFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(CSV_PATH);
  } catch {
    const csv = stringify([], { header: true, columns: CSV_COLUMNS });
    await fs.writeFile(CSV_PATH, csv, "utf8");
  }
}

async function readWatched() {
  await ensureCsvFile();
  const content = await fs.readFile(CSV_PATH, "utf8");
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  });

  return records.map((r) => ({
    imdbID: String(r.imdbID ?? ""),
    title: String(r.title ?? ""),
    year: String(r.year ?? ""),
    poster: String(r.poster ?? ""),
    imdbRating: Number(r.imdbRating ?? 0),
    runtime: Number(r.runtime ?? 0),
    userRating: Number(r.userRating ?? 0),
  }));
}

async function writeWatched(list) {
  await ensureCsvFile();
  const rows = list.map((m) => ({
    imdbID: String(m.imdbID ?? ""),
    title: String(m.title ?? ""),
    year: String(m.year ?? ""),
    poster: String(m.poster ?? ""),
    imdbRating: Number(m.imdbRating ?? 0),
    runtime: Number(m.runtime ?? 0),
    userRating: Number(m.userRating ?? 0),
  }));
  const csv = stringify(rows, {
    header: true,
    columns: CSV_COLUMNS,
  });
  await fs.writeFile(CSV_PATH, csv, "utf8");
  // eslint-disable-next-line no-console
  console.log(`Wrote ${rows.length} movie(s) to CSV`);
}

function normalizeMovie(input) {
  const movie = {
    imdbID: String(input?.imdbID ?? "").trim(),
    title: String(input?.title ?? "").trim(),
    year: String(input?.year ?? "").trim(),
    poster: String(input?.poster ?? "").trim(),
    imdbRating: Number(input?.imdbRating ?? 0),
    runtime: Number(input?.runtime ?? 0),
    userRating: Number(input?.userRating ?? 0),
  };

  if (!movie.imdbID) return null;
  return movie;
}

let app = express();
app.use(cors());
app.use(express.json({ limit: "256kb" }));

app.use((req, _res, next) => {
  // eslint-disable-next-line no-console
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, csvPath: CSV_PATH });
});

app.get("/api/watched", async (_req, res) => {
  try {
    const list = await readWatched();
    res.json(list);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("GET /api/watched error:", err);
    res.status(500).json({ error: String(err?.message ?? err) });
  }
});

app.post("/api/watched", async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
    const movie = normalizeMovie(req.body);
    if (!movie) return res.status(400).json({ error: "Missing imdbID" });

    const list = await readWatched();
    const next = [movie, ...list.filter((m) => m.imdbID !== movie.imdbID)];
    await writeWatched(next);
    // eslint-disable-next-line no-console
    console.log(`Wrote ${next.length} movie(s) to CSV`);
    res.json(next);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("POST /api/watched error:", err);
    res.status(500).json({ error: String(err?.message ?? err) });
  }
});

app.delete("/api/watched/:imdbID", async (req, res) => {
  try {
    const imdbID = String(req.params.imdbID ?? "").trim();
    const list = await readWatched();
    const next = list.filter((m) => m.imdbID !== imdbID);
    await writeWatched(next);
    // eslint-disable-next-line no-console
    console.log(`Deleted ${imdbID}, ${next.length} movie(s) in CSV`);
    res.status(204).end();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("DELETE /api/watched error:", err);
    res.status(500).json({ error: String(err?.message ?? err) });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`CSV watched API running on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`CSV file: ${CSV_PATH}`);
});
