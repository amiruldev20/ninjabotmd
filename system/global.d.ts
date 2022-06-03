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

//-- MODULE INTERNAL
import Client from './client';
import Command from './cmd';

export declare global {
	var set: typeof import('../database/settings.json');
	var util: typeof import('./util');
	var database: {
		[k: string]: any;
	};
	var client: Client;
	var cmd: Command;
	var opts: any,
	var sock: any;
	var socket: any;
	var renz: proto;
	var db: any;
}
