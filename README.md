# vterm

VT terminal emulator monorepo. Pure TypeScript, zero dependencies.

## Packages

| Package                     | npm                                                  | Description                                                                      |
| --------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------- |
| [vt100.js](packages/vt100/) | [`vt100.js`](https://www.npmjs.com/package/vt100.js) | Strict VT100 — monochrome, cursor, scroll regions, DA1/DSR                       |
| [vt220.js](packages/vt220/) | [`vt220.js`](https://www.npmjs.com/package/vt220.js) | VT220 — 8 colors, insert/delete, selective erase, soft reset                     |
| [vterm.js](packages/vterm/) | [`vterm.js`](https://www.npmjs.com/package/vterm.js) | Modern terminal emulator — 100% of [terminfo.dev](https://terminfo.dev) features |

## Why three packages?

**vt100.js** is the strict baseline — a monochrome DEC VT100 (1978) emulator with bold, underline, blink, and inverse. No colors, no insert/delete operations. Fast and minimal.

**vt220.js** adds what VT220 brought — 8 standard colors, insert/delete characters and lines, selective erase, hidden/conceal attribute, and soft reset. Covers ~90% of real-world terminal usage.

**vterm.js** is comprehensive — it targets 100% coverage of the [terminfo.dev feature matrix](https://terminfo.dev): every SGR attribute, every cursor mode, every DEC private mode, every OSC/DCS sequence, device attribute responses, mouse tracking, synchronized output, text reflow, and Unicode rendering (emoji ZWJ, regional indicators, variation selectors).

Use vt100.js for strict VT100 conformance. Use vt220.js for most terminal testing. Use vterm.js when you need everything.

## Install

```bash
npm install vt100.js    # Strict VT100 emulator (monochrome)
npm install vt220.js    # VT220 emulator (8 colors, insert/delete)
npm install vterm.js    # Modern full-featured emulator
```

## Quick Start

```typescript
import { createVt100Screen } from "vt100.js"

const screen = createVt100Screen({ cols: 80, rows: 24 })
screen.process(new TextEncoder().encode("Hello, \x1b[1mBold\x1b[0m World!"))
console.log(screen.getText()) // "Hello, Bold World!"
```

```typescript
import { createVtermScreen } from "vterm.js"

const screen = createVtermScreen({ cols: 80, rows: 24 })
screen.process(new TextEncoder().encode("\x1b[1;4:3;38;2;255;100;0mStyled\x1b[0m"))
const cell = screen.getCell(0, 0)
// cell.bold === true, cell.underline === "curly", cell.fg === { r: 255, g: 100, b: 0 }
```

## Development

```bash
npm install
npm test          # Run all tests
npm run typecheck # TypeScript check
```

## Ecosystem

- [Termless](https://termless.dev) — headless terminal testing (uses vt100.js as default backend)
- [Terminfo.dev](https://terminfo.dev) — terminal feature support tables (tests both packages)
- [Silvery](https://silvery.dev) — React TUI framework

## License

MIT
