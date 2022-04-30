import Client from './client';
import Command from './cmd';
declare global {
	var set: typeof import('../database/settings.json');
	var util: typeof import('./util');
	var database: {
		[k: string]: any;
	};
	var client: Client;
	var cmd: Command;
	var aviewonce: any,
	var asticker: any,
	var usr: any,
	var opts: any,
}
