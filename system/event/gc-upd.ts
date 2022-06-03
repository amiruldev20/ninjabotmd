/*
-----------------------
Name: Ninjabot MD
Author: Amirul Dev
Github: amiruldev20
Instagram: amiruldev20
-----------------------
Thanks to: Istiqmal
-----------------------
tambahin aja nama lu, hargai yang buat
*/

global.client.socket.ev.on('groups.update', async (update) => {
	if (global.database.group[update[0].id!]) {
		global.database.group[update[0].id!].subject = update[0].subject;
	}
});