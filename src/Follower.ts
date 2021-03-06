import EventEmitter from 'events';
import { Client, Command, SubCommand } from './Client';
import { Get, Intersects, Nearby, Scan, Search, Within } from './commands';
import {
    BoundsResponse,
    ChansResponse,
    ConfigGetResponse,
    ConfigKeys,
    HooksResponse,
    InfoFollowerResponse,
    JSONResponse,
    JsonGetResponse,
    KeysResponse,
    PingResponse,
    ServerExtendedResponse,
    ServerFollowerResponse,
    StatsResponse,
} from './responses';
import {
    FollowerInterface,
    GetInterface,
    IntersectsInterface,
    NearbyInterface,
    ScanInterface,
    SearchInterface,
    WithinInterface,
} from './specs';

export class Follower extends EventEmitter implements FollowerInterface {
    readonly client: Client;

    constructor(url: string) {
        super();

        this.client = new Client(url).on('error', (error) => {
            /* istanbul ignore next */
            this.emit('error', error);
        });
    }

    bounds(key: string): Promise<BoundsResponse> {
        return this.client.command(Command.BOUNDS, [key]);
    }

    chans(pattern = '*'): Promise<ChansResponse> {
        return this.client.command(Command.CHANS, [pattern]);
    }

    configGet(name: ConfigKeys): Promise<ConfigGetResponse> {
        return this.client.command(Command.CONFIG, [Command.GET, name]);
    }

    configSet(name: ConfigKeys, value: string | number): Promise<JSONResponse> {
        return this.client.command(Command.CONFIG, [Command.SET, name, value]);
    }

    configRewrite(): Promise<JSONResponse> {
        return this.client.command(Command.CONFIG, [SubCommand.REWRITE]);
    }

    gc(): Promise<JSONResponse> {
        return this.client.command(Command.GC);
    }

    get(key: string, id: string): GetInterface {
        return new Get(this.client, key, id);
    }

    hooks(pattern = '*'): Promise<HooksResponse> {
        return this.client.command(Command.HOOKS, [pattern]);
    }

    healthz(): Promise<JSONResponse> {
        return this.client.command(Command.HEALTHZ);
    }

    info(): Promise<InfoFollowerResponse> {
        return this.client.command(Command.INFO);
    }

    intersects(key: string): IntersectsInterface {
        return new Intersects(this.client, key);
    }

    jGet(
        key: string,
        id: string,
        path?: string,
        mode?: 'RAW'
    ): Promise<JsonGetResponse> {
        return this.client.command(Command.JGET, [
            key,
            id,
            ...(path ? [path] : []),
            ...(mode ? [mode] : []),
        ]);
    }

    keys(pattern = '*'): Promise<KeysResponse> {
        return this.client.command(Command.KEYS, [pattern]);
    }

    nearby(key: string): NearbyInterface {
        return new Nearby(this.client, key);
    }

    ping(): Promise<PingResponse> {
        return this.client.command(Command.PING);
    }

    scan(key: string): ScanInterface {
        return new Scan(this.client, key);
    }

    search(key: string): SearchInterface {
        return new Search(this.client, key);
    }

    server(): Promise<ServerFollowerResponse> {
        return this.client.command(Command.SERVER);
    }

    serverExtended(): Promise<ServerExtendedResponse> {
        return this.client.command(Command.SERVER, ['EXT']);
    }

    stats(...keys: string[]): Promise<StatsResponse> {
        return this.client.command(Command.STATS, keys);
    }

    within(key: string): WithinInterface {
        return new Within(this.client, key);
    }

    async quit(force = false): Promise<void> {
        return this.client.quit(force);
    }
}
