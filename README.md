## IAM Rectification for Kozen

Kozen module to verify and rectify MongoDB IAM roles and permissions. Supports SCRAM and X.509, provides IoC-ready services, and optional CLI/MCP controllers. Produces a clear diff of required vs actual permissions plus username and roles.

### 🎯 Features

- Auth methods: SCRAM-SHA and X.509
- Integrations: Kozen IoC services, CLI controller, MCP tools
- Output: Permission diff (missing, extra, present), username, roles
- TypeScript: Fully typed API

### 🏭 Install

```bash
npm install @kozen/iam-rectification
```

### 🚀 Quick start from CLI
```
kozen --moduleLoad=@kozen/iam-rectification --action=iam-rectification:help [options]
```

### 🚀 Quick start from Develoment

```ts
import { IAMRectificationModule } from '@kozen/iam-rectification';

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

### 📚 References
- [IAM Rectification Module Full Documentation](https://github.com/mongodb-industry-solutions/kozen-iam-rectification/wiki)
- [IAM Rectification Module through DeepWiki](https://deepwiki.com/mongodb-industry-solutions/kozen-iam-rectification)
- [Disclaimer and Usage Policy](https://github.com/mongodb-industry-solutions/kozen-engine/wiki/POLICY)
- [How to Contribute to Kozen Ecosystem](https://github.com/mongodb-industry-solutions/kozen-engine/wiki/Contribute)
- [Official Kozen Documentation](https://github.com/mongodb-industry-solutions/kozen-engine/wiki)

## 🤖 Links
- [Issues](https://github.com/mongodb-industry-solutions/kozen-iam-rectification/issues)
- [Repository](https://github.com/mongodb-industry-solutions/kozen-iam-rectification)

## 📋 License

MIT © MDB SAT

---

← Previous: [Home](https://github.com/mongodb-industry-solutions/kozen-iam-rectification/wiki) | Next: [Kozen Integration](https://github.com/mongodb-industry-solutions/kozen-iam-rectification/wiki/Kozen-Integration) →

---