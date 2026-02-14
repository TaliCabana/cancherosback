import 'dotenv/config';
/* import router from "./src/routes/index.routes.js"; */
import Server from "./src/server/config.js";

const server = new Server();

/* server.app.use('/api', router); */

if (process.env.NODE_ENV === 'production') {
server.listen();
}

export default server.app;