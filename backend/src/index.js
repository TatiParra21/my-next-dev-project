"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Point to the correct location of .env manually
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') }); // ✅
const project_ideas_db_1 = require("./project_ideas_db");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/database", project_ideas_db_1.router);
app.use((req, res) => {
    res.status(404).json({ message: "end point not found" });
});
app.get('/', (req, res) => {
    res.send('Hello from backend!');
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
