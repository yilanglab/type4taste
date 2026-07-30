import {
  Check,
  MousePointer2,
  RotateCcw,
  Search,
  Sparkles,
  Type,
  X,
} from "lucide-react"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import {
  FONT_CATALOG,
  inferFontRole,
  rankFonts,
  type FontCandidate,
  type FontRole,
} from "./catalog"

interface TargetSnapshot {
  element: HTMLElement
  rect: DOMRect
  tag: string
  role: FontRole
  text: string
  fontFamily: string
  fontSize: string
  fontWeight: string
  lineHeight: string
  letterSpacing: string
}

interface OriginalFontStyle {
  value: string
  priority: string
}

type PreviewScope = "element" | "role"

const TEXT_SELECTOR =
  "[data-type-role], h1, h2, h3, h4, p, blockquote, figcaption, li, dt, dd, button, a, code"

function isPluginElement(target: HTMLElement) {
  return Boolean(target.closest("[data-type4taste-ui]"))
}

function findTextElement(target: HTMLElement): HTMLElement | null {
  if (isPluginElement(target)) return null
  const candidate = target.closest(TEXT_SELECTOR) as HTMLElement | null
  if (!candidate || !candidate.innerText.trim()) return null
  return candidate
}

function snapshotElement(element: HTMLElement): TargetSnapshot {
  const style = getComputedStyle(element)
  return {
    element,
    rect: element.getBoundingClientRect(),
    tag: element.tagName.toLowerCase(),
    role: inferFontRole(element),
    text: element.innerText.trim().replace(/\s+/g, " ").slice(0, 90),
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
  }
}

function matchScore(font: FontCandidate, role: FontRole, index: number) {
  const roleScore = font.roles.includes(role) ? 94 : 76
  return Math.max(72, roleScore - index * 3)
}

export function Type4Taste() {
  const [active, setActive] = useState(false)
  const [hovered, setHovered] = useState<TargetSnapshot | null>(null)
  const [selected, setSelected] = useState<TargetSnapshot | null>(null)
  const [query, setQuery] = useState("")
  const [scope, setScope] = useState<PreviewScope>("element")
  const [appliedFontId, setAppliedFontId] = useState<string | null>(null)
  const [loadingFontId, setLoadingFontId] = useState<string | null>(null)
  const [fontError, setFontError] = useState<string | null>(null)
  const originalsRef = useRef(new Map<HTMLElement, OriginalFontStyle>())
  const loadedFontsRef = useRef(new Set<string>())

  const refreshSelected = useCallback(() => {
    setSelected((current) =>
      current ? snapshotElement(current.element) : current
    )
    setHovered((current) =>
      current ? snapshotElement(current.element) : current
    )
  }, [])

  useEffect(() => {
    if (!active) {
      setHovered(null)
      return
    }

    const onPointerMove = (event: PointerEvent) => {
      const element = findTextElement(event.target as HTMLElement)
      setHovered(element ? snapshotElement(element) : null)
    }

    const onClick = (event: MouseEvent) => {
      const element = findTextElement(event.target as HTMLElement)
      if (!element) return
      event.preventDefault()
      event.stopPropagation()
      setSelected(snapshotElement(element))
      setHovered(null)
      setActive(false)
      setQuery("")
      setFontError(null)
    }

    document.addEventListener("pointermove", onPointerMove, true)
    document.addEventListener("click", onClick, true)
    return () => {
      document.removeEventListener("pointermove", onPointerMove, true)
      document.removeEventListener("click", onClick, true)
    }
  }, [active])

  useEffect(() => {
    const onViewportChange = () => refreshSelected()
    window.addEventListener("resize", onViewportChange)
    window.addEventListener("scroll", onViewportChange, true)
    return () => {
      window.removeEventListener("resize", onViewportChange)
      window.removeEventListener("scroll", onViewportChange, true)
    }
  }, [refreshSelected])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === "t") {
        event.preventDefault()
        setActive((current) => !current)
      }
      if (event.key === "Escape") {
        setActive(false)
        setHovered(null)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const rankedFonts = useMemo(
    () => (selected ? rankFonts(selected.role) : FONT_CATALOG),
    [selected]
  )

  const visibleFonts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase()
    if (!normalized) return rankedFonts
    return FONT_CATALOG.filter((font) =>
      [
        font.label,
        font.family,
        font.source,
        font.license,
        ...font.languages,
        ...font.characteristics,
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalized)
    )
  }, [query, rankedFonts])

  const getScopeElements = useCallback(() => {
    if (!selected) return []
    if (scope === "element") return [selected.element]
    const root = selected.element.closest("[data-demo-root]") ?? document
    return Array.from(
      root.querySelectorAll<HTMLElement>(
        `[data-type-role="${selected.role}"]`
      )
    )
  }, [scope, selected])

  const restoreElements = useCallback((elements: HTMLElement[]) => {
    for (const element of elements) {
      const original = originalsRef.current.get(element)
      if (!original) continue
      if (original.value) {
        element.style.setProperty(
          "font-family",
          original.value,
          original.priority
        )
      } else {
        element.style.removeProperty("font-family")
      }
      originalsRef.current.delete(element)
    }
  }, [])

  const restoreCurrentScope = useCallback(() => {
    restoreElements(getScopeElements())
    setAppliedFontId(null)
    requestAnimationFrame(refreshSelected)
  }, [getScopeElements, refreshSelected, restoreElements])

  const restorePage = useCallback(() => {
    restoreElements([...originalsRef.current.keys()])
    setAppliedFontId(null)
    requestAnimationFrame(refreshSelected)
  }, [refreshSelected, restoreElements])

  const ensureFontLoaded = useCallback(async (font: FontCandidate) => {
    if (loadedFontsRef.current.has(font.id)) return
    setLoadingFontId(font.id)
    setFontError(null)

    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLLinkElement>(
        `link[data-type4taste-font="${font.id}"]`
      )
      if (existing) {
        loadedFontsRef.current.add(font.id)
        resolve()
        return
      }

      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = font.cssUrl
      link.dataset.type4tasteFont = font.id
      link.onload = () => {
        loadedFontsRef.current.add(font.id)
        resolve()
      }
      link.onerror = () => reject(new Error(`无法加载 ${font.label}`))
      document.head.appendChild(link)
    })

    setLoadingFontId(null)
  }, [])

  const applyFont = useCallback(
    async (font: FontCandidate) => {
      if (!selected) return
      try {
        await ensureFontLoaded(font)
        const elements = getScopeElements()
        for (const element of elements) {
          if (!originalsRef.current.has(element)) {
            originalsRef.current.set(element, {
              value: element.style.getPropertyValue("font-family"),
              priority: element.style.getPropertyPriority("font-family"),
            })
          }
          element.style.setProperty(
            "font-family",
            `"${font.family}", sans-serif`,
            "important"
          )
        }
        setAppliedFontId(font.id)
        requestAnimationFrame(refreshSelected)
      } catch (error) {
        setLoadingFontId(null)
        setFontError(
          error instanceof Error ? error.message : "字体加载失败，请稍后重试"
        )
      }
    },
    [ensureFontLoaded, getScopeElements, refreshSelected, selected]
  )

  const currentFont = FONT_CATALOG.find((font) => font.id === appliedFontId)

  return (
    <>
      {hovered ? (
        <SelectionFrame snapshot={hovered} mode="hover" />
      ) : null}
      {selected ? (
        <SelectionFrame snapshot={selected} mode="selected" />
      ) : null}

      {active ? (
        <div
          data-type4taste-ui
          className="t4t-selection-notice"
          role="status"
        >
          <MousePointer2 size={14} />
          移动并点击任意文字
          <kbd>Esc</kbd>
        </div>
      ) : null}

      {selected ? (
        <aside
          data-type4taste-ui
          className="t4t-panel"
          aria-label="字体试配面板"
        >
          <header className="t4t-panel-header">
            <div>
              <p className="t4t-kicker">
                <Sparkles size={12} />
                Context match
              </p>
              <h2>为这段文字试字体</h2>
            </div>
            <button
              type="button"
              className="t4t-icon-button"
              aria-label="关闭字体面板"
              onClick={() => setSelected(null)}
            >
              <X size={17} />
            </button>
          </header>

          <div className="t4t-target-card">
            <div className="t4t-target-meta">
              <span>{selected.tag}</span>
              <span>{selected.role}</span>
              <span>{selected.fontSize}</span>
              <span>{selected.fontWeight}</span>
            </div>
            <p>{selected.text}</p>
            <span className="t4t-current-font">
              当前 · {currentFont?.label ?? selected.fontFamily.split(",")[0]}
            </span>
          </div>

          <fieldset className="t4t-scope">
            <legend>应用范围</legend>
            <label>
              <input
                type="radio"
                name="scope"
                checked={scope === "element"}
                onChange={() => setScope("element")}
              />
              当前元素
            </label>
            <label>
              <input
                type="radio"
                name="scope"
                checked={scope === "role"}
                onChange={() => setScope("role")}
              />
              全部 {selected.role}
            </label>
          </fieldset>

          <label className="t4t-search">
            <Search size={15} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索字体、风格或语种"
            />
            <span>{visibleFonts.length}</span>
          </label>

          <div className="t4t-list-heading">
            <span>{query ? "搜索结果" : "根据当前内容排序"}</span>
            <span>免费商用字库</span>
          </div>

          <div className="t4t-font-list">
            {visibleFonts.map((font, index) => {
              const selectedFont = appliedFontId === font.id
              const loading = loadingFontId === font.id
              return (
                <button
                  key={font.id}
                  type="button"
                  className="t4t-font-option"
                  data-selected={selectedFont || undefined}
                  data-font-id={font.id}
                  aria-label={`试用 ${font.label}`}
                  onClick={() => void applyFont(font)}
                  onPointerEnter={() => void ensureFontLoaded(font)}
                  disabled={loading}
                >
                  <span
                    className="t4t-font-sample"
                    style={{ fontFamily: `"${font.family}", sans-serif` }}
                  >
                    字体 Aa
                  </span>
                  <span className="t4t-font-copy">
                    <strong>{font.label}</strong>
                    <small>{font.reason}</small>
                    <span className="t4t-font-tags">
                      <span>{font.source}</span>
                      <span>{font.license}</span>
                      <span>{font.languages[0]}</span>
                    </span>
                  </span>
                  <span className="t4t-font-score">
                    {selectedFont ? (
                      <Check size={15} />
                    ) : loading ? (
                      "…"
                    ) : (
                      matchScore(font, selected.role, index)
                    )}
                  </span>
                </button>
              )
            })}
          </div>

          {fontError ? <p className="t4t-error">{fontError}</p> : null}

          <footer className="t4t-panel-footer">
            <button type="button" onClick={restoreCurrentScope}>
              <RotateCcw size={14} />
              恢复这组
            </button>
            <button type="button" onClick={restorePage}>
              恢复整页
            </button>
            <button
              type="button"
              className="t4t-agent-button"
              disabled
              title="Agent Bridge 将在下一阶段接入"
            >
              <Sparkles size={14} />
              Agent Bridge · 下一步
            </button>
          </footer>
        </aside>
      ) : null}

      <div data-type4taste-ui className="t4t-launcher-wrap">
        <p className="t4t-launcher-hint">
          {selected
            ? currentFont
              ? `${currentFont.label} 正在试用`
              : "已取得文字上下文"
            : "从真实内容开始"}
        </p>
        <button
          type="button"
          className="t4t-launcher"
          data-active={active || undefined}
          aria-pressed={active}
          onClick={() => setActive((current) => !current)}
        >
          <Type size={16} strokeWidth={2.3} />
          <span>Type4Taste</span>
          <kbd>⌥ T</kbd>
        </button>
      </div>
    </>
  )
}

function SelectionFrame({
  snapshot,
  mode,
}: {
  snapshot: TargetSnapshot
  mode: "hover" | "selected"
}) {
  return (
    <div
      data-type4taste-ui
      className="t4t-selection-frame"
      data-mode={mode}
      style={{
        top: snapshot.rect.top,
        left: snapshot.rect.left,
        width: snapshot.rect.width,
        height: snapshot.rect.height,
      }}
    >
      <span>
        {snapshot.tag} · {snapshot.role}
      </span>
      <i />
      <b />
    </div>
  )
}
