# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a macOS command-line utility package (`@hexie/impaste`) that provides two clipboard image manipulation tools:
- **`impaste`**: Extracts PNG images from clipboard to stdout
- **`imcopy`**: Copies PNG images from stdin to clipboard

## Development Commands

```bash
# Install dependencies
bun install

# Run tests
bun test

# Run a specific test file
bun test tests/integration.test.ts

# Lint code (uses Biome)
bun run lint

# Format code (uses Biome)
bun run format

# Type check (TypeScript)
bun run typecheck

# Test the CLIs locally
cat demo/example.png | bun ./imcopy.ts  # Copy to clipboard
bun ./index.ts > output.png              # Paste from clipboard
```

## Architecture

Both tools follow the same pattern:
1. Use temporary files in `/tmp` with UUID naming for safe concurrent usage
2. Leverage macOS AppleScript for clipboard operations
3. Handle PNG format specifically (`«class PNGf»`)
4. Provide comprehensive error messages and proper exit codes
5. Clean up temporary files in finally blocks

**Key implementation details:**
- AppleScript is used via `osascript -e` commands to interact with macOS clipboard
- Both tools check clipboard format before operations to ensure PNG compatibility
- Error handling includes AppleScript errors, file I/O errors, and empty input validation
- The tools are designed to work in Unix pipes

## Bun-specific Guidelines

This project uses Bun exclusively:
- Use `bun <file>` instead of `node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun install` instead of `npm install`
- Use `bun run <script>` instead of `npm run <script>`
- Prefer `Bun.file` API over Node.js `fs` methods where applicable
- Use `spawn` from 'bun' package for process execution

## Testing Approach

Tests are located in `tests/` directory:
- Unit tests for individual tools
- Integration test verifying both tools work together
- Tests use actual clipboard operations (macOS only)
- Example image provided in `demo/example.png`
