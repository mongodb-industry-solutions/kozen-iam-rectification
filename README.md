## IAM Rectification for Kozen

Kozen module to verify and rectify MongoDB IAM roles and permissions. Supports SCRAM and X.509, provides IoC-ready services, and optional CLI/MCP controllers. Produces a clear diff of required vs actual permissions plus username and roles.

### 🎯 Features

- Auth methods: SCRAM-SHA and X.509
- Integrations: Kozen IoC services, CLI controller, MCP tools
- Output: Permission diff (missing, extra, present), username, roles
- TypeScript: Fully typed API

### 🏭 Install

```bash
npm install @mongodb-solution-assurance/kozen-iam-rectification
```

### 🚀 Quick start

```ts
import { IAMRectificationModule } from '@mongodb-solution-assurance/kozen-iam-rectification';

const mod = new IAMRectificationModule();
const deps = await mod.register({ type: 'cli' }); // or 'mcp' or null
await assistant.registerAll(deps);

const scram = await assistant.resolve('iam-rectification:scram');
const result = await scram.rectify({
  uriEnv: 'MONGODB_URI',
  permissions: ['read', 'find']
});

console.log(result);
```

### 📚 Full documentation

See the wiki for complete guides, APIs, and examples:
`https://github.com/mongodb-industry-solutions/kozen-iam-rectification/wiki`

## 📋 License

MIT © MDB SAT

## 🤖 References
- [Kozen Documentation](https://github.com/mongodb-industry-solutions/kozen-engine/wiki)
- [Homepage](https://github.com/mongodb-industry-solutions/kozen-iam-rectification#readme)
- [Issues](https://github.com/mongodb-industry-solutions/kozen-iam-rectification/issues)
- [Repository](https://github.com/mongodb-industry-solutions/kozen-iam-rectification)


