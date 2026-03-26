# vterm — VT Terminal Emulator Monorepo

Pure TypeScript VT terminal emulators. Zero dependencies. Two packages at different abstraction levels.

## Packages

### vt100.js (`packages/vt100/`)

Minimal VT100/VT220/xterm emulator covering ~90% of real-world terminal usage. Default backend for [Termless](https://termless.dev) test suites.

- **Exports**: `createVt100Screen`, `Vt100Screen`, `Vt100ScreenOptions`, `ScreenCell`, `CellColor`, `UnderlineStyle`
- **Capabilities**: SGR (16/256/truecolor), cursor movement, erase, scroll regions, alternate screen, OSC title
- **Source**: Single file — `src/screen.ts` (the entire emulator)

### vterm.js (`packages/vterm/`)

Full-featured modern emulator targeting 100% of the [terminfo.dev](https://terminfo.dev) feature matrix.

- **Exports**: `createVtermScreen`, `VtermScreen`, `VtermScreenOptions`, `ScreenCell`, `CellColor`, `UnderlineStyle`, `SemanticZone`, `SixelImage`
- **Capabilities**: Everything in vt100.js plus: underline styles (curly/dotted/dashed), overline, blink, underline color, cursor shape (DECSCUSR), mouse tracking, focus tracking, synchronized output, Kitty keyboard protocol, scrollback buffer, wide characters (CJK, emoji ZWJ), OSC hyperlinks/clipboard/colors, DCS/APC sequences, DA1/DA2/DA3, DECRPM, character sets, soft reset
- **Source**: Single file — `src/screen.ts` (the entire emulator)

## Key Files

```
packages/vt100/src/screen.ts    # VT100-era emulator (complete implementation)
packages/vt100/src/index.ts     # Re-exports from screen.ts
packages/vterm/src/screen.ts    # Modern emulator (complete implementation)
packages/vterm/src/index.ts     # Re-exports from screen.ts
packages/*/tests/screen.test.ts # Tests for each package
vitest.config.ts                # Test config — includes packages/*/tests/**/*.test.ts
```

## Commands

```bash
# From monorepo root (vendor/vt100/ when inside km)
bun vitest run                           # Run all tests
bun vitest run packages/vt100/tests/     # vt100.js tests only
bun vitest run packages/vterm/tests/     # vterm.js tests only
bun run typecheck                        # TypeScript check (tsc --noEmit)
```

## Code Style

- Factory functions (`createVt100Screen`, `createVtermScreen`), no classes
- Each emulator is a single self-contained file (`screen.ts`) with no internal module dependencies
- Zero external dependencies — pure TypeScript
- ESM only, `.ts` extensions in imports, published as raw TypeScript source
- `engines.node >= 23.6.0` (native type stripping)

## Ecosystem

- [Termless](https://termless.dev) uses vt100.js as its default terminal backend
- [Terminfo.dev](https://terminfo.dev) tests both packages against the feature matrix
- [Silvery](https://silvery.dev) React TUI framework (same author)

## API Pattern

Both packages share the same API shape:

```typescript
const screen = createVt100Screen({ cols: 80, rows: 24 }) // or createVtermScreen
screen.process(new TextEncoder().encode("\x1b[1mHello\x1b[0m"))
screen.getText() // Plain text content
screen.getCell(row, col) // Per-cell attributes (fg, bg, bold, etc.)
```
