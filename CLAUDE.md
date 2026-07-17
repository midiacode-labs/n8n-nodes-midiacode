# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`n8n-nodes-midiacode` — an n8n community node package that exposes the Midiacode content API (content CRUD/publish, push notifications) as n8n workflow nodes. Published to npm; consumed by n8n as a community node.

Requires Node.js 22 (`.nvmrc`). Run `nvm use` before anything else.

## Commands

```bash
make install        # npm ci
make lint           # npm run lint  (n8n-node lint — n8n's node-specific ruleset)
make lint-fix       # npm run lint:fix
make test           # jest
make test-coverage  # jest --coverage
make ci             # install + lint + test + build — mirrors .github/workflows/ci.yml
make build          # npm run build, then copies dist/* to ~/.n8n/custom/ for local n8n testing
npm run dev         # n8n-node dev — live-reload node inside a local n8n instance
```

Run a single test: `npx jest -t "should have search operation configured correctly"`
Run one file: `npx jest nodes/Midiacode/Midiacode.node.test.ts`

Build/lint/dev/release all go through the `@n8n/node-cli` (`n8n-node <cmd>`) rather than raw tsc/eslint — it applies n8n's community-node conventions and `"strict": true` from the `n8n` block in package.json. Lint is the authority on style; don't hand-format against `.prettierrc.js` (it declares tabs, while the node file uses 4 spaces).

## Architecture

This is a **declarative-style** n8n node. `nodes/Midiacode/Midiacode.node.ts` has **no `execute()` method** — the entire class is one `description: INodeTypeDescription` object, and every HTTP call is expressed as a `routing` block on a property descriptor. n8n's declarative engine assembles the request at runtime. Consequences:

- **Adding an operation** = adding an entry to the `operation` options array with `routing.request` (method + url), plus parameter properties gated on it via `displayOptions.show`. No imperative code.
- **Adding a parameter** = a property with `routing.send` — `type: 'body'` or `type: 'query'`, `property:` being the snake_case API field name (n8n params are camelCase, the API is snake_case; the mapping lives only in `routing.send.property`).
- **Expressions** in url/value strings must be prefixed with `=` (e.g. `url: '=/public/content/{{$parameter.contentId}}/'`). Missing the `=` silently sends the literal template.

### Duplicate-name pattern (important)

n8n keys parameters by `name`, so the same logical field needs a distinct `name` per routing target, differentiated by `displayOptions`:

- `workspaceId` (search, path segment) / `workspaceIdBody` (create, publish, update, updateLink → body) / `workspaceIdQuery` (get, getLink → query)
- `contentId` (get/update/getLink/updateLink → path segment, no routing) / `contentIdPublish` (publish → body `content_id`)
- `status` (search filter) / `statusPublish` (publish payload)

All display the same `displayName` to the user. When adding an operation, check whether an existing field needs a new variant rather than reusing one across incompatible routing types.

### Two base URLs

`requestDefaults.baseURL` is `https://contentcore.midiacode.pt`. The Push Notification `send` operation overrides it per-operation with `baseURL: 'https://account.midiacode.pt'` in its `routing.request`. Any new account-service operation must do the same.

### Credentials

`credentials/MidiacodeApi.credentials.ts` — API key sent as the `X-API-Key` header via `IAuthenticateGeneric`. The credential holds both `apiKey` and a `workspaceId`, but the credential's `workspaceId` exists **only** for the `test` request (`/public/check-api-key/`); node operations take workspace from their own parameters, not from the credential.

## Tests

`nodes/Midiacode/Midiacode.node.test.ts` asserts on the shape of the `description` object (property existence, routing methods/urls, option values) — it does not make HTTP requests or exercise n8n's routing engine. Several tests are count-based (e.g. "should have 7 operations defined", resource options length), so adding a resource or operation requires updating those counts.

## Conventions

- Register new nodes/credentials in the `n8n` block of package.json, pointing at the compiled `dist/**/*.js` paths.
- Gitflow: work branches off `develop`, releases via `release/*` into `main`. Feature branches: `feature/<name>`.
- `CHANGELOG.md` (Keep a Changelog + SemVer) and the package.json `version` are updated together at release time; `npm run release` drives release-it.
- `README.md` documents every operation and parameter for end users — update it when the node's surface changes.
