const http = require("http");
const express = require("express");
const cors = require("cors");

/** Init app */
const app = express();

/** CORS */
app.use(cors());
/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());




/** Server */
const httpServer = http.createServer(app);
const PORT = process.env.PORT ?? 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));