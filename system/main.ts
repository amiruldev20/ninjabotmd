import {
config
} from 'dotenv';
import {
schedule
} from 'node-cron';
import {
logger,
run
} from './util';
import {
existsSync,
rmdirSync
} from 'fs';

try {
config({
path: '../.env',
});
schedule('*/10 * * * *', () => {
if (existsSync('temp')) {
rmdirSync('./temp', {
recursive: true,
});
}
});
run();
} catch (e) {
throw logger.format(e);
}