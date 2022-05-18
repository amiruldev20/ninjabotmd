global.client.socket.ev.on('groups.update', async (update) => {
	if (global.database.group[update[0].id!]) {
		global.database.group[update[0].id!].subject = update[0].subject;
	}
});