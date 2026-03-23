# vt100.js

Pure TypeScript VT100 terminal emulator. Zero dependencies, headless, fast.

## Features

- Full VT100/ANSI escape sequence parsing
- SGR attributes (bold, italic, underline, colors, etc.)
- 16-color, 256-color, and 24-bit truecolor support
- Cursor movement, save/restore (DECSC/DECRC)
- Screen modes (alternate screen, auto-wrap, origin mode, etc.)
- Scroll regions (DECSTBM) with content preservation
- Scrollback buffer with configurable limit
- Insert/delete characters and lines
- Wide character support (CJK, emoji)
- Zero dependencies -- works in Bun, Node.js, and browsers

## Comparison

| Package | Screen State | SGR Colors | Scrollback | Wide Chars | Zero Deps | Size |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|
| **vt100.js** | yes | 16/256/true | yes | yes | yes | ~30KB |
| `@xterm/headless` | yes | 16/256/true | yes | yes | no | ~500KB |
| `node-pty` + xterm | yes | 16/256/true | yes | yes | no | native build |
| `ansi-parser` | no | parse only | no | no | yes | ~5KB |
| `terminal-kit` | yes | 16/256/true | no | partial | no | ~2MB |
| `blessed` / `neo-blessed` | yes | 16/256 | no | no | no | ~1MB |

## Install

```bash
npm install vt100.js
```

## Usage

```typescript
import { createVt100Screen } from "vt100.js"

const screen = createVt100Screen({ cols: 80, rows: 24 })
screen.process(new TextEncoder().encode("Hello, \x1b[1mBold\x1b[0m World!"))

// Read cell state
const cell = screen.getCell(0, 0)
console.log(cell.char)  // "H"

// Read text
console.log(screen.getText())  // "Hello, Bold World!"

// Check cursor position
const pos = screen.getCursorPosition()
console.log(pos)  // { x: 18, y: 0 }
```

## API

### `createVt100Screen(options)`

Create a new screen instance.

```typescript
const screen = createVt100Screen({
  cols: 80,          // terminal width
  rows: 24,          // terminal height
  scrollbackLimit: 1000  // max scrollback lines (default: 1000)
})
```

### Screen methods

| Method | Description |
|--------|-------------|
| `process(data: Uint8Array)` | Feed raw terminal data |
| `getText()` | Get all text (scrollback + screen) |
| `getTextRange(startRow, startCol, endRow, endCol)` | Get text in a range |
| `getLine(row)` | Get cells for a row |
| `getCell(row, col)` | Get a single cell (char, fg, bg, bold, etc.) |
| `getCursorPosition()` | Get cursor `{ x, y }` |
| `getCursorVisible()` | Check cursor visibility |
| `getMode(mode)` | Check terminal mode (`altScreen`, `bracketedPaste`, etc.) |
| `getTitle()` | Get window title (set via OSC 0/2) |
| `getScrollbackLength()` | Number of scrollback lines |
| `getViewportOffset()` | Current viewport scroll offset |
| `scrollViewport(delta)` | Scroll viewport by delta lines |
| `resize(cols, rows)` | Resize the terminal |
| `reset()` | Reset to initial state |

### Cell properties

```typescript
interface ScreenCell {
  char: string           // character content
  fg: CellColor | null   // foreground color { r, g, b }
  bg: CellColor | null   // background color { r, g, b }
  bold: boolean
  faint: boolean
  italic: boolean
  underline: UnderlineStyle  // "none" | "single" | "double" | "curly" | "dotted" | "dashed"
  strikethrough: boolean
  inverse: boolean
  hidden: boolean
  wide: boolean          // true for CJK/emoji double-width chars
}
```

### Terminal modes

Queryable via `screen.getMode(mode)`:

- `altScreen` -- alternate screen buffer
- `bracketedPaste` -- bracketed paste mode
- `mouseTracking` -- mouse tracking
- `autoWrap` -- auto-wrap at right margin (default: on)
- `applicationCursor` -- application cursor keys
- `applicationKeypad` -- application keypad mode
- `originMode` -- origin mode
- `insertMode` -- insert mode
- `reverseVideo` -- reverse video
- `focusTracking` -- focus tracking
- `cursorVisible` -- cursor visibility

## Ecosystem

- [Termless](https://termless.dev) -- headless terminal testing (uses vt100.js as its default backend)
- [Terminfo.dev](https://terminfo.dev) -- terminal feature support tables
- [Silvery](https://silvery.dev) -- React TUI framework
- [@termless/vt100](https://github.com/beorn/termless) -- Termless backend wrapper for vt100.js

## License

MIT
