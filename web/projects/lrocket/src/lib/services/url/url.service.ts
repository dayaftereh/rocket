import { Injectable } from "@angular/core";

@Injectable()
export class URLService {
    constructor() { }

    getRoot(): URL {
        const url: URL = new URL(window.location.toString());
        return url;
    }

    join(...paths: string[]): string {
        return paths.join("/").replace(/\/{2,}/, "/");
    }

    getWebSocketRoot(): URL {
        const root: URL = this.getRoot();

        const protocol: string = root.protocol;

        if (protocol.startsWith("https")) {
            root.protocol = "wss:";
        } else {
            root.protocol = "ws:";
        }

        return root;
    }

    getWebSocketPath(): string {
        const root: URL = this.getWebSocketRoot();
        root.pathname = this.join("api", "ws");
        return root.toString();
    }

    getApiPath(path: string): string {
        const root: URL = this.getRoot();
        root.pathname = this.join("api", path);
        return root.toString();
    }

    getGraphqlPath(): string {
        const url: string = this.getApiPath("graphql");
        return url;
    }
}