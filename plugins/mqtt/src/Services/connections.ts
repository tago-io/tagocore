import type { ITagoIOClient } from "../Events/onConnect.ts";

class Connection {
  private connections: { [key: string]: ITagoIOClient[] } = {};
  public getConnections(channel: string) {
    return this.connections[channel] || [];
  }

  public addConnection(channel: string, client: any) {
    if (this.connections[channel]) {
      this.connections[channel].push(client);
    } else {
      this.connections[channel] = [client];
    }
  }

  public delConnection(channel: string, connID: string) {
    if (this.connections[channel]) {
      this.connections[channel] = this.connections[channel].filter(
        (x) => x.connID !== connID,
      );

      if (!this.connections[channel].length) {
        delete this.connections[channel];
      }
    }
  }

  public countConnections(channel) {
    return (this.connections[channel] || []).length;
  }

  public listChannels() {
    return Object.keys(this.connections);
  }

  public async restart() {
    const clients: ITagoIOClient[] = Object.keys(this.connections).reduce(
      (f, c) => f.concat(this.connections[c]),
      [] as ITagoIOClient[],
    );
    for (const client of clients) {
      client.destroy();
    }
    this.connections = {};
  }
}

export default Connection;
