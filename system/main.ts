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