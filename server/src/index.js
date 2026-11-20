import "dotenv/config";
import app from "./app.js";

const { PORT = 5001 } = process.env;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));