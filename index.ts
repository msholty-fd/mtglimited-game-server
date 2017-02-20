import * as path from 'path';
import * as express from 'express';
import * as serveIndex from 'serve-index';
import { createServer } from 'http';
import { Server } from 'colyseus';
import { DraftRoom } from "./app/DraftRoom";

const port = process.env.PORT || 2657;
const app = express();
const httpServer = createServer(app);
const gameServer = new Server({ server: httpServer });

gameServer.register("draft", DraftRoom, {
  maxClients: 10
});

app.use(express.static(path.join(__dirname, "static")));
app.use('/', serveIndex(path.join(__dirname, "static"), { icons: true }))

httpServer.listen(port);

console.log(`Listening on http://localhost:${ port }`);
