import * as path from 'path';
import * as express from 'express';
import { readFileSync } from 'fs';
import { createServer } from 'https';
import { Server } from 'colyseus';
import { DraftRoom } from "./app/DraftRoom";
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

const port = process.env.PORT || 2657;
const app = express();
const httpsServer = createServer({
  key: readFileSync('key.pem'),
  cert: readFileSync('cert.pem')
}, app);
const gameServer = new Server({ server: httpsServer });

app.use(cors());
app.use(bodyParser.json());

gameServer.register('draft', DraftRoom, {
  maxClients: 10
});

app.route('/rooms')
  .get((req, res) => {
    const rooms = gameServer.getRoomsById();
    const availableRooms = gameServer.getAvailableRooms();
    console.log(rooms);
    res.send({
      rooms,
      availableRooms,
    });
  }).put((req, res) => {
    const id = req.body.id;
    console.log(req.body);
    console.log(`creating draft/${id}`);
    gameServer.register(`draft/${id}`, DraftRoom, {
      maxClients: 10,
    });
    res.send(id);
  });

httpsServer.listen(port);

console.log(`Listening on https://localhost:${ port }`);
