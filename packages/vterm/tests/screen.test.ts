import { describe, test, expect } from "vitest"
import { createVtermScreen } from "../src/index.ts"

const enc = new TextEncoder()

describe("vterm screen", () => {
  test("creates with default dimensions", () => {
    const screen = createVtermScreen()
    expect(screen.cols).toBe(80)
    expect(screen.rows).toBe(24)
  })

  test("creates with custom dimensions", () => {
    const screen = createVtermScreen({ cols: 120, rows: 40 })
    expect(screen.cols).toBe(120)
    expect(screen.rows).toBe(40)
  })

  test("cursor starts at origin", () => {
    const screen = createVtermScreen()
    expect(screen.getCursorPosition()).toEqual({ x: 0, y: 0 })
  })

  test("cursor is visible by default", () => {
    const screen = createVtermScreen()
    expect(screen.getCursorVisible()).toBe(true)
  })

  test("cursor shape defaults to block", () => {
    const screen = createVtermScreen()
    expect(screen.getCursorShape()).toBe("block")
  })

  test("reset returns to initial state", () => {
    const screen = createVtermScreen()
    screen.process(enc.encode("hello"))
    screen.reset()
    expect(screen.getCursorPosition()).toEqual({ x: 0, y: 0 })
    expect(screen.getTitle()).toBe("")
  })

  test("autoWrap is on by default", () => {
    const screen = createVtermScreen()
    expect(screen.getMode("autoWrap")).toBe(true)
  })

  test("resize updates dimensions", () => {
    const screen = createVtermScreen({ cols: 80, rows: 24 })
    screen.resize(120, 40)
    expect(screen.cols).toBe(120)
    expect(screen.rows).toBe(40)
  })
})
