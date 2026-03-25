/**
 * vterm.js — Modern terminal emulator
 *
 * Full VT/ECMA-48/xterm standards coverage. Pure TypeScript, zero dependencies.
 * Targets 100% of terminfo.dev's feature matrix:
 *
 * - All SGR attributes (bold, faint, italic, underline styles, overline, strikethrough, blink, hidden, inverse)
 * - 16-color, 256-color, 24-bit truecolor (foreground, background, underline color)
 * - Full cursor control (CUP, CUU/CUD/CUF/CUB, CPR, CHA, CNL, CPL, HVP, save/restore)
 * - Cursor shape (DECSCUSR — block, underline, bar, blinking variants)
 * - Erase operations (ED 0/1/2/3, EL 0/1/2, ECH)
 * - Editing operations (ICH, DCH, IL, DL, REP)
 * - Scroll regions (DECSTBM, SU, SD) with content preservation
 * - DEC private modes (alt screen, auto-wrap, origin, insert, reverse video, bracketed paste)
 * - Mouse tracking (X10, normal, button, any-event, SGR format)
 * - Focus tracking (mode 1004)
 * - Application cursor keys & keypad
 * - Synchronized output (mode 2026)
 * - Scrollback buffer with configurable limit
 * - Wide character support (CJK, emoji ZWJ, regional indicators, VS-16)
 * - OSC sequences (title, hyperlinks, clipboard, colors)
 * - DCS sequences (DECRQSS, XTGETTCAP)
 * - DA1/DA2/DA3 device attribute responses
 * - DSR (device status report) responses
 * - DECRPM (mode reporting)
 * - Character sets (DEC Special Graphics, UTF-8)
 * - Full C0/C1 control code handling
 * - Text reflow on resize
 *
 * @see https://terminfo.dev for the feature matrix
 * @see https://github.com/beorn/vterm for the monorepo
 */

// ── Types ──────────────────────────────────────────────────────────────

export interface CellColor {
  r: number
  g: number
  b: number
}

export type UnderlineStyle = "none" | "single" | "double" | "curly" | "dotted" | "dashed"

export interface ScreenCell {
  char: string
  fg: CellColor | null
  bg: CellColor | null
  bold: boolean
  faint: boolean
  italic: boolean
  underline: UnderlineStyle
  underlineColor: CellColor | null
  overline: boolean
  strikethrough: boolean
  inverse: boolean
  hidden: boolean
  blink: boolean
  wide: boolean
  url: string | null
}

export interface ScreenOptions {
  cols?: number
  rows?: number
  scrollbackLimit?: number
  /** Callback for DA1/DA2/DSR responses — write these back to the PTY */
  onResponse?: (data: string) => void
}

export interface Screen {
  readonly cols: number
  readonly rows: number

  process(data: Uint8Array): void
  resize(cols: number, rows: number): void
  reset(): void

  getCell(row: number, col: number): ScreenCell
  getLine(row: number): ScreenCell[]
  getText(): string
  getTextRange(startRow: number, startCol: number, endRow: number, endCol: number): string

  getCursorPosition(): { x: number; y: number }
  getCursorVisible(): boolean
  getCursorShape(): "block" | "underline" | "bar"
  getCursorBlinking(): boolean

  getTitle(): string
  getMode(mode: string): boolean

  getScrollbackLength(): number
  getViewportOffset(): number
  scrollViewport(delta: number): void
}

// ── Implementation ─────────────────────────────────────────────────────

const EMPTY_CELL: ScreenCell = Object.freeze({
  char: "",
  fg: null,
  bg: null,
  bold: false,
  faint: false,
  italic: false,
  underline: "none" as UnderlineStyle,
  underlineColor: null,
  overline: false,
  strikethrough: false,
  inverse: false,
  hidden: false,
  blink: false,
  wide: false,
  url: null,
})

function emptyCell(): ScreenCell {
  return { ...EMPTY_CELL }
}

export function createScreen(options: ScreenOptions = {}): Screen {
  let cols = options.cols ?? 80
  let rows = options.rows ?? 24
  const scrollbackLimit = options.scrollbackLimit ?? 1000
  const onResponse = options.onResponse

  // Grid state
  let grid: ScreenCell[][] = createGrid(cols, rows)
  let altGrid: ScreenCell[][] = createGrid(cols, rows)
  let scrollback: ScreenCell[][] = []

  // Cursor state
  let cursorX = 0
  let cursorY = 0
  let cursorVisible = true
  let cursorShape: "block" | "underline" | "bar" = "block"
  let cursorBlinking = true
  let savedCursor = { x: 0, y: 0, attrs: emptyCell() }

  // SGR state
  let attrs = emptyCell()

  // Mode flags
  let altScreen = false
  let autoWrap = true
  let originMode = false
  let insertMode = false
  let bracketedPaste = false
  let applicationCursor = false
  let applicationKeypad = false
  let mouseTracking = false
  let focusTracking = false
  let reverseVideo = false
  let syncOutput = false

  // Scroll region
  let scrollTop = 0
  let scrollBottom = rows - 1

  // OSC state
  let title = ""

  // Viewport
  let viewportOffset = 0

  // Parser state
  let state: "ground" | "escape" | "csi" | "osc" | "dcs" | "apc" = "ground"
  let paramStr = ""
  let oscStr = ""
  let intermediates = ""
  let wrapPending = false

  // TODO: implement full parser and operations
  // This is the skeleton — the full implementation will cover all 111 terminfo.dev features

  function createGrid(w: number, h: number): ScreenCell[][] {
    const g: ScreenCell[][] = []
    for (let i = 0; i < h; i++) {
      g.push(createRow(w))
    }
    return g
  }

  function createRow(w: number): ScreenCell[] {
    const row: ScreenCell[] = []
    for (let i = 0; i < w; i++) {
      row.push(emptyCell())
    }
    return row
  }

  function process(data: Uint8Array): void {
    for (let i = 0; i < data.length; i++) {
      const byte = data[i]!
      processByte(byte, data, i)
    }
  }

  function processByte(_byte: number, _data: Uint8Array, _index: number): void {
    // TODO: Full state machine parser
    // Will handle: C0 controls, ESC sequences, CSI sequences, OSC, DCS, APC
  }

  function resize(newCols: number, newRows: number): void {
    // TODO: resize with reflow
    cols = newCols
    rows = newRows
    grid = createGrid(cols, rows)
    scrollTop = 0
    scrollBottom = rows - 1
  }

  function reset(): void {
    grid = createGrid(cols, rows)
    altGrid = createGrid(cols, rows)
    scrollback = []
    cursorX = 0
    cursorY = 0
    cursorVisible = true
    cursorShape = "block"
    cursorBlinking = true
    attrs = emptyCell()
    altScreen = false
    autoWrap = true
    originMode = false
    insertMode = false
    bracketedPaste = false
    applicationCursor = false
    applicationKeypad = false
    mouseTracking = false
    focusTracking = false
    reverseVideo = false
    syncOutput = false
    scrollTop = 0
    scrollBottom = rows - 1
    title = ""
    viewportOffset = 0
    state = "ground"
    paramStr = ""
    oscStr = ""
    intermediates = ""
    wrapPending = false
  }

  // Suppress unused variable warnings — these are used by the TODO implementation
  void [
    altGrid, scrollback, savedCursor, altScreen, originMode, insertMode,
    bracketedPaste, applicationCursor, applicationKeypad, mouseTracking,
    focusTracking, reverseVideo, syncOutput, scrollTop, scrollBottom,
    viewportOffset, state, paramStr, oscStr, intermediates, wrapPending,
    onResponse, scrollbackLimit,
  ]

  return {
    get cols() { return cols },
    get rows() { return rows },
    process,
    resize,
    reset,
    getCell: (row, col) => grid[row]?.[col] ?? EMPTY_CELL,
    getLine: (row) => grid[row] ?? [],
    getText: () => grid.map(row => row.map(c => c.char || " ").join("").trimEnd()).join("\n"),
    getTextRange: (_sr, _sc, _er, _ec) => "", // TODO
    getCursorPosition: () => ({ x: cursorX, y: cursorY }),
    getCursorVisible: () => cursorVisible,
    getCursorShape: () => cursorShape,
    getCursorBlinking: () => cursorBlinking,
    getTitle: () => title,
    getMode: (mode) => {
      switch (mode) {
        case "altScreen": return altScreen
        case "autoWrap": return autoWrap
        case "originMode": return originMode
        case "insertMode": return insertMode
        case "bracketedPaste": return bracketedPaste
        case "applicationCursor": return applicationCursor
        case "applicationKeypad": return applicationKeypad
        case "mouseTracking": return mouseTracking
        case "focusTracking": return focusTracking
        case "reverseVideo": return reverseVideo
        case "syncOutput": return syncOutput
        case "cursorVisible": return cursorVisible
        default: return false
      }
    },
    getScrollbackLength: () => scrollback.length,
    getViewportOffset: () => viewportOffset,
    scrollViewport: (delta) => {
      viewportOffset = Math.max(0, Math.min(scrollback.length, viewportOffset + delta))
    },
  }
}
