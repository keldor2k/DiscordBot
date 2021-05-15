module.exports = {
	name: 'say',
	execute(message, args) {
		const sayMessage = args.join(" ");
		message.delete({ timeout: 2000 })
			.then(msg => console.log(`Deleted message from ${msg.author.username} after 2 seconds`))
			.catch(console.error);
		message.channel.send(sayMessage);
	},
};