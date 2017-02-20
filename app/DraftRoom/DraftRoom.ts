import { Room } from 'colyseus';
import { Player } from '../Player';

export class DraftRoom extends Room < any > {
  constructor(options) {
    super(options);
    this.setPatchRate(1000);
    this.setState({
      messages: [],
      players: {},
      isDraftStarted: false,
    });
    console.log("ChatRoom created!", options);
  }

  requestJoin(options) {
    return this.clients.length < this.options.maxClients;
  }

  onJoin(client) {
    this.state.messages.push(`${ client.id } joined.`);
    this.state.players[client.id] = new Player({
      id: client.id,
    });
    console.log(client.id, "joined!");
  }

  onLeave(client) {
    this.state.messages.push(`${ client.id } left.`);
    delete this.state.players[client.id];
    console.log(this.clients);
  }

  onMessage(client, data) {
    if (data.message) {
      this.state.messages.push(data.message);
    }

    this.state.isDraftStarted = !!data.isDraftStarted;
    if (this.state.isDraftStarted) {
      this.startDraft();
    }

    console.log("DraftRoom:", client.id, data);
    console.log(this.state);
  }

  startDraft() {
    // loop through each player
    // Generate a pack
    // give pack to player
  }

  onDispose() {
    console.log("Dispose ChatRoom");
  }
}
