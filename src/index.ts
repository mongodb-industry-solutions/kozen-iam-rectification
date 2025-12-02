import { KzModule, IConfig, IDependency } from "@kozen/engine";
import cli from "./configs/cli.json";
import ioc from "./configs/ioc.json";
import mcp from "./configs/mcp.json";
import fs from 'fs';
import path from 'path';

export class IAMRectificationModule extends KzModule {

    constructor(dependency?: any) {
        super(dependency);
        this.metadata.alias = 'iam-rectification';
        try {
            const pac = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'));
            this.metadata.summary = pac.description;
            this.metadata.version = pac.version;
            this.metadata.author = pac.author;
            this.metadata.license = pac.license;
            this.metadata.name = pac.name;
            this.metadata.uri = pac.homepage;
        }
        catch (error) {
            this.assistant?.logger?.warn({
                src: 'Module:IAMRectification',
                msg: `Failed to load package.json metadata: ${(error as Error).message}`
            });
        }
    }

    public register(config: IConfig | null, opts?: any): Promise<Record<string, IDependency> | null> {
        let dep: Record<string, any> = {};
        switch (config?.type) {
            case 'mcp':
                dep = { ...ioc, ...mcp };
                break;
            case 'cli':
                dep = { ...ioc, ...cli };
                break;
            default:
                dep = ioc;
                break;
        }
        dep = this.fix(dep);
        return Promise.resolve(dep);
    }
}

export default IAMRectificationModule;
export * from "./models/IAMRectification";
export * from "./services/IAMRectificationScram";
export * from "./services/IAMRectificationX509";