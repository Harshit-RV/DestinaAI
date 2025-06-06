"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const travelplan_route_1 = __importDefault(require("./routes/travelplan.route"));
const users_route_1 = __importDefault(require("./routes/users.route"));
const cors_1 = __importDefault(require("cors"));
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = __importDefault(require("./config"));
// Create a single supabase client for interacting with your database
const supabase = (0, supabase_js_1.createClient)(config_1.default.supabaseUrl, config_1.default.supabaseApiKey);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('Hello World 2!');
});
app.use('/travelplan', travelplan_route_1.default);
app.use('/users', users_route_1.default);
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
// weather app
// database connection
