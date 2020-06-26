const { Task } = require("klasa");
const fetch = require("node-fetch");

module.exports = class extends Task {
  constructor(...args) {
    super(...args, { name: "spotifyToken", enabled: true });
  }

  async run() {
    this.getToken();
  }

  async init() {
    if (
      !this.client.options.config.spotify.clientID ||
      !this.client.options.config.spotify.clientSecret
    ) {
      this.client.emit(
        "wtf",
        `Spotify Client ID or Client Secret not provided, disabling the ${this.name} task.`
      );
      this.disable();
      return;
    }

    this.getToken();
  }

  async getToken() {
    const token = Buffer.from(
      `${this.client.options.config.spotify.clientID}:${this.client.options.config.spotify.clientSecret}`
    ).toString("base64");
    let res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `grant_type=client_credentials`
    });
    res = await res.json();
    this.client._spotify = res.access_token;
  }
};
