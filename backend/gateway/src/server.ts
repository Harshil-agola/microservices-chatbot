import app from "./app.js";
import { ENV_CONFIG } from "./config/env.js";

app.listen(ENV_CONFIG.BACKEND_PORT, () => {
    console.log(`Server is running on port ${ENV_CONFIG.BACKEND_PORT}`);
})