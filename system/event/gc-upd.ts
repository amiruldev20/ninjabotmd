client.socket.ev.on('groups.update', async (update) => {
	if (database.group[update[0].id!]) {
		database.group[update[0].id!].subject = update[0].subject;
	}
});