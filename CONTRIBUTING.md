# Contributing to A1

A1 is a cryptographic identity and authorization layer for AI agents. Thanks for taking the time to contribute.

This document covers how to set up a development environment, what the code standards are, and how the PR process works.

---

## Table of Contents

1. [Getting started](#1-getting-started)
2. [What you can contribute](#2-what-you-can-contribute)
3. [Development setup](#3-development-setup)
4. [Code standards](#4-code-standards)
5. [Pull requests](#5-pull-requests)
6. [Security issues](#6-security-issues)
7. [Contributor License Agreement](#7-contributor-license-agreement)
8. [Code of Conduct](#8-code-of-conduct)

---

## 1. Getting started

If you've found a bug, open an [issue](https://github.com/dyologician/A1/issues) first so we can discuss it before you invest time writing a fix. For features, same thing — a quick issue conversation saves everyone effort.

For typos, documentation fixes, and small obvious bugs, feel free to open a PR directly.

---

## 2. What you can contribute

- Bug fixes
- New SDK integrations (framework tools, middleware, etc.)
- Documentation improvements
- Test coverage
- Performance improvements with benchmarks
- Security fixes — see [Section 6](#6-security-issues) before opening anything publicly

---

## 3. Development setup

You only need to set up the languages relevant to what you're changing.

### Prerequisites

| Tool | Minimum version | Used for |
|---|---|---|
| Rust | 1.85+ via `rustup` | Core crate, gateway, CLI, storage adapters |
| Node.js | 20+ | TypeScript SDK |
| Python | 3.9+ | Python SDK |
| Go | 1.21+ | Go SDK |
| Docker + Docker Compose | Latest stable | Gateway and integration tests |

### Setup

```bash
git clone https://github.com/dyologician/A1
cd A1
```

**Rust (core + gateway + CLI):**

```bash
cargo build --workspace --all-features
cargo test --workspace --all-features
```

**Integration tests (requires Docker):**

```bash
docker compose -f docker/docker-compose.yml up -d redis postgres
cargo test --test integration
cargo test --test passport_integration
```

**Python SDK:**

```bash
cd sdk/python
pip install -e ".[dev]"
pytest
```

**TypeScript SDK:**

```bash
cd sdk/typescript
npm install
npx tsc --noEmit
npx jest
```

**Go SDK:**

```bash
cd sdk/go
go test -v ./...
go test -race ./...
```

---

## 4. Code standards

### Rust

- Format: `cargo fmt --all` must pass with no diff.
- Lint: `cargo clippy --all-targets --all-features -- -D warnings` — zero warnings.
- `unsafe` is only allowed in the `ffi` module, gated behind the `ffi` feature flag, with a doc comment explaining the safety contract.
- All public APIs need rustdoc comments. Non-trivial functions should include a `# Examples` doctest.
- New public API needs tests: at minimum a happy path, an invalid-signature case, and a scope-escalation case.
- New features must be gated behind a feature flag and compile cleanly with and without it.
- Don't allocate in the hot authorization path. Run `cargo bench` before and after if you touch `NarrowingMatrix` or `DyoloChain::authorize`.

### TypeScript

- `strict: true` is enforced. No `any` — use `unknown` with a type guard where the type is genuinely dynamic.
- Must pass `npx tsc --noEmit` clean.
- New public API exported from `src/index.ts`. Integration tools from `src/integrations.ts`.
- Code must work with both ESM and CJS builds.

### Python

- Must pass `mypy --strict`.
- Format with `black`, lint with `ruff check`.
- All parameters and return values must be typed.
- All network operations must be `async`. Sync wrappers are fine but must not block the event loop.
- `httpx` is the only required dependency. Everything else must be an optional extra in `pyproject.toml`.
- Python 3.9+ support required.

### Go

- Must pass `gofmt -l .` (no output) and `go vet ./...`.
- No `panic` in library code. Return errors explicitly with exported error types.
- Test with both `go test -v ./...` and `go test -race ./...`.

---

## 5. Pull requests

### Before opening a PR

- [ ] Rebased on latest `main` — no merge commits.
- [ ] Commits are logically separated with clear messages.
- [ ] Full test suite passes locally for every language you touched.
- [ ] Tests added for every new behavior.
- [ ] Documentation updated for any user-visible change.
- [ ] If you changed a wire format, there's a backward-compatibility test with a fixture from the previous version.

### CI

All jobs must pass before a PR will be reviewed:

| Job | Checks |
|---|---|
| Rust | `cargo fmt`, `cargo clippy -D warnings`, `cargo test --all-features` |
| Python | `pytest` |
| TypeScript | `tsc --noEmit`, `jest` |
| Go | `go test -v ./...` |

### Commit message format

[Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `chore`, `security`

Scopes: `core`, `gateway`, `cli`, `python`, `typescript`, `go`, `redis`, `pg`, `ffi`, `zk`, `did`

Examples:

```
feat(core): add ML-DSA-65 hybrid signature support
fix(gateway): correct rate limiter bucket refill
docs(python): add LlamaIndex integration guide
security(core): use subtle::ConstantTimeEq for nonce comparison
```

### Review process

- Open the PR with a description of the problem, the solution, and any tradeoffs.
- A maintainer will review within 5 business days.
- Address review comments and re-request review after each round.
- Once approved and CI is green, a maintainer will merge.

---

## 6. Security issues

If you find a security vulnerability, **do not open a public issue or PR.**

Email **workwithdyolo@gmail.com** with details. We'll respond quickly, develop a fix in a private fork, and coordinate a release with you. Contributors are credited in CHANGELOG.md and SECURITY.md by default — let us know if you'd prefer to stay anonymous.

---

## 7. Contributor License Agreement

By submitting a pull request, you confirm that:

1. The contribution is your original work, or you have the right to submit it.
2. You grant the maintainers a perpetual, worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your contribution under the MIT OR Apache-2.0 license.
3. If you're contributing on behalf of an employer, you have the authority to grant this license.

---

## 8. Code of Conduct

Be professional and constructive. Harassment, personal attacks, and discriminatory behavior aren't tolerated in any project space.

Report issues to workwithdyolo@gmail.com.

---

*Every contribution — code, docs, tests, bug reports — makes A1 better. Thanks for being here.*
