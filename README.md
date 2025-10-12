## @mongodb-solution-assurance/iam-rectification

Kozen module that verifies and rectifies MongoDB IAM roles and permissions. Supports both SCRAM and X.509 authentication, provides IoC-ready services, and exposes MCP tools for agent/workflow integrations.

- **Framework integration**: Registers Kozen IoC dependencies and optional controllers (CLI/MCP)
- **Auth methods**: SCRAM-SHA (user/password) and X.509 (certificates)
- **Output**: Clear report of missing, extra, and present permissions, plus username and roles
- **TypeScript types**: Full typings included

### Installation

```bash
npm install @mongodb-solution-assurance/iam-rectification
```

This package depends on the Kozen framework and IAM utilities, which are installed automatically:
- `@mongodb-solution-assurance/kozen`
- `@mongodb-solution-assurance/iam-util`

### What this module provides

When loaded, the module registers IoC bindings and (optionally) controllers depending on the chosen runtime type:

- IoC services (always registered)
  - `iam:rectification:scram` → SCRAM rectification service
  - `iam:rectification:x509` → X.509 rectification service

- Controllers (registered by type)
  - type `cli` → `RectificationCLIController`
  - type `mcp` → `RectificationMCPController`

### Quick start (Kozen module)

Use the module to populate your Kozen container, then resolve and call the rectification service you need.

```ts
import { IAMRectificationModule } from '@mongodb-solution-assurance/iam-rectification';

// 1) Register dependencies for your runtime
const mod = new IAMRectificationModule();
const deps = await mod.register({ type: 'cli' }); // or { type: 'mcp' } or null

// 2) Wire the returned dependencies into your Kozen IoC container
//    (exact wiring depends on your Kozen app setup)
const assistant = /* your Kozen IoC/assistant instance */;
await assistant.registerAll(deps);

// 3) Resolve and execute SCRAM rectification
const scram = await assistant.resolve('iam:rectification:scram');
const result = await scram.rectify({
  // Provide either `uri` or `uriEnv`, or let the service build a URI from parts
  // uri: 'mongodb+srv://user:pass@host/?retryWrites=true&w=majority&appName=AppName',
  uriEnv: 'MONGODB_URI',
  permissions: ['read', 'find', 'insert']
});

console.log(result);
```

### Programmatic API

Interfaces returned by the IoC bindings:

```ts
export interface IRectificationOption {
  host?: string;
  app?: string;
  uri?: string;      // full connection string
  uriEnv?: string;   // name of env var that contains the URI
  username?: string; // SCRAM only (when building URI)
  password?: string; // SCRAM only (when building URI)
  method?: string;   // SCRAM auth method label (e.g., SCRAM-SHA-256)
  protocol?: string; // 'mongodb' | 'mongodb+srv'
  isCluster?: boolean;
  permissions: string[]; // required permissions to verify
}

export interface IRectificationOptionX509 extends IRectificationOption {
  key?: string;      // PEM private key (inline)
  cert?: string;     // PEM cert (inline)
  ca?: string;       // PEM CA cert (inline)
  certPath?: string; // optional path (alternative to inline)
  caPath?: string;   // optional path (alternative to inline)
}

export interface IRectificationResponse {
  permissions: {
    extra: string[];   // privileges present but not required
    missing: string[]; // privileges required but not present
    present: string[]; // privileges required and present
  };
  username?: string;
  roles?: string[];
}
```

#### Behavior and defaults

- If `uri` is omitted, a URI is constructed from available parts:
  - SCRAM: `mongodb+srv://[username:password@]host/?retryWrites=true&w=majority&appName=app`
  - X.509: `mongodb+srv://host/?retryWrites=true&w=majority&appName=app`
- If neither `uri` nor `uriEnv` yields a value, an error is thrown.
- Default `permissions` (if omitted): `['search','read','find','insert','update','remove','collMod']`.
- `protocol` defaults to `mongodb+srv` when `isCluster` is true, otherwise `mongodb`.
- X.509: if `cert` and `key` are provided (inline PEM), a TLS secure context is created and used.

### MCP tools (Model Context Protocol)

When registered with `type: 'mcp'`, the module exposes two MCP tools you can call from compatible clients/agents:

- `kozen_iam_rectification_verify_scram`
  - Description: Evaluate roles/permissions for a MongoDB connection using SCRAM.
  - Input schema fields: `host`, `app`, `uri`, `uriEnv`, `username`, `password`, `method` (`SCRAM-SHA-1`|`SCRAM-SHA-256`), `protocol` (`mongodb`|`mongodb+srv`), `isCluster`, `permissions` (CSV or array).

- `kozen_iam_rectification_verify_x509`
  - Description: Evaluate roles/permissions for a MongoDB connection using X.509.
  - Input schema fields: same as above plus `key`, `cert`, `ca`, `certPath`, `caPath` (all optional).

Example MCP tool call payload:

```json
{
  "toolName": "kozen_iam_rectification_verify_scram",
  "args": {
    "uriEnv": "MONGODB_URI",
    "permissions": ["read", "find", "insert"]
  }
}
```

### CLI controller

If you register the module with `type: 'cli'`, the `RectificationCLIController` is available via Kozen’s CLI wiring. It provides:

- `verifySCRAM(options)`
- `verifyX509(options)`
- `help()` that prints documentation from `rectification.txt`

Note: This package does not ship its own standalone CLI binary; integrate it into your Kozen CLI application.

### Environment variables

- `MONGODB_URI` (or any variable referenced by `uriEnv`) can be used instead of inlining sensitive URIs.
- `KOZEN_IAM_URI_ENV` may be used by the CLI wiring to supply a default `uriEnv`.

PowerShell example:

```powershell
$env:MONGODB_URI = "mongodb+srv://user:pass@cluster.example.mongodb.net/?retryWrites=true&w=majority&appName=MyApp"
```

### Examples

Minimal SCRAM verification using an environment variable:

```ts
const result = await scram.rectify({
  uriEnv: 'MONGODB_URI',
  permissions: ['read', 'find']
});
```

X.509 verification using inline PEM data:

```ts
const x509 = await assistant.resolve('iam:rectification:x509');
const report = await x509.rectify({
  uri: 'mongodb+srv://cluster.example.mongodb.net/?appName=MyApp',
  cert: process.env.CLIENT_CERT_PEM!,
  key: process.env.CLIENT_KEY_PEM!,
  ca: process.env.CA_CERT_PEM!,
  permissions: ['read', 'insert', 'update']
});
```

### Output

```json
{
  "permissions": {
    "extra": ["collMod"],
    "missing": ["insert"],
    "present": ["read", "find"]
  },
  "username": "appUser",
  "roles": ["readWrite", "clusterMonitor"]
}
```

### Requirements

- Node.js 18+ recommended
- TypeScript support optional (types included)

### License

MIT © MDB SAT

### Links

- Homepage: `https://github.com/mongodb-industry-solutions/kozen-iam-rectification#readme`
- Issues: `https://github.com/mongodb-industry-solutions/kozen-iam-rectification/issues`
- Repository: `https://github.com/mongodb-industry-solutions/kozen-iam-rectification`


