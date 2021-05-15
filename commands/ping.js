module.exports = {
	name: 'ping',
	async execute(message) {
		// Round-trip latency AND average latency between bot and websocket server (one-way)
		const m = await message.channel.send("Ping?");
		m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(message.client.ws.ping)}ms`);
	},
};