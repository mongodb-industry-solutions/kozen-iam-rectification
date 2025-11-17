import { KzModule, IConfig, IDependency } from "@mongodb-solution-assurance/kozen";
import cli from "./configs/cli.json";
import ioc from "./configs/ioc.json";
import mcp from "./configs/mcp.json";

export class IAMRectificationModule extends KzModule {

    constructor(dependency?: any) {
        super(dependency);
        this.metadata.summary = 'Module for IAM Rectification functionalities';
        this.metadata.alias = 'iam-rectification';
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

export * from "./models/IAMRectification";
export * from "./services/IAMRectificationScram";
export * from "./services/IAMRectificationX509";