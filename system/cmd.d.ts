import { Proto } from './client.d';

export namespace ICommandHandler {
    export interface Event extends AdditonalEvent {
        name: string;
        cmd: {
            string: string[];
            regExp: (string | RegExp)[];
        };
        tag: string[];
        help: string;
        index: number;
        callback: (renz: Proto, property: CommandProperty) => Promise<any> | any;
        prefix: boolean;
        enable: boolean;
    }
    export interface AdditonalEvent {
        alternativeCommand?: (string | RegExp)[];
        mediaCustomReply?: string[] | string;
        wait?: boolean | string;
        query?: string;
        owner?: boolean | string;
        group?: boolean | string;
        regist?: boolean | string;
        info?: boolean | string;
    }
    export interface CommandProperty {
        event: Event;
        text: string;
        query: string;
        cmd: string;
        commandWithQuery: string;
        prefix: string;
        modify: (event: Event) => Event;
    }
}