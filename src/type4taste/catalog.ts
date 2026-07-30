export type FontRole = "brand" | "display" | "body" | "ui" | "mono"

export interface FontCandidate {
  id: string
  family: string
  label: string
  source: "Google Fonts" | "ZSFT"
  license: string
  languages: string[]
  roles: FontRole[]
  cssUrl: string
  reason: string
  characteristics: string[]
}

export const FONT_CATALOG: FontCandidate[] = [
  {
    id: "noto-serif-sc",
    family: "Noto Serif SC",
    label: "Noto Serif SC",
    source: "Google Fonts",
    license: "OFL-1.1",
    languages: ["简体中文", "Latin"],
    roles: ["display", "body"],
    cssUrl:
      "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap",
    reason: "宋体骨架清楚，标题有编辑感，长段落也能保持稳定的阅读灰度。",
    characteristics: ["衬线", "研究感", "长文"],
  },
  {
    id: "lxgw-wenkai",
    family: "LXGW WenKai",
    label: "霞鹜文楷",
    source: "Google Fonts",
    license: "OFL-1.1",
    languages: ["简体中文", "繁体中文", "Latin"],
    roles: ["display", "body"],
    cssUrl:
      "https://fonts.googleapis.com/css2?family=LXGW+WenKai:wght@400;700&display=swap",
    reason: "书写感温和但字面规整，适合需要人文气质的标题、引文和短正文。",
    characteristics: ["楷体", "人文", "温和"],
  },
  {
    id: "wenyuan-rounded",
    family: "WenYuan Rounded SC VF",
    label: "文渊圆体 SC",
    source: "ZSFT",
    license: "OFL-1.1",
    languages: ["简体中文", "Latin"],
    roles: ["display", "body", "ui"],
    cssUrl: "https://fontsapi.zeoseven.com/414/main/result.css",
    reason: "圆角收笔降低工具感的生硬程度，中西文混排尺寸接近，适合友好的产品表达。",
    characteristics: ["圆体", "可变", "友好"],
  },
  {
    id: "sarasa-ui",
    family: "Sarasa Ji UI",
    label: "更纱圆纪黑体 UI",
    source: "ZSFT",
    license: "OFL-1.1",
    languages: ["简体中文", "繁体中文", "Latin"],
    roles: ["body", "ui", "mono"],
    cssUrl: "https://fontsapi.zeoseven.com/618/main/result.css",
    reason: "为屏幕和多语种混排优化，字符辨识度高，适合正文、导航和参数信息。",
    characteristics: ["无衬线", "UI", "多语种"],
  },
  {
    id: "newsreader",
    family: "Newsreader",
    label: "Newsreader",
    source: "Google Fonts",
    license: "OFL-1.1",
    languages: ["Latin"],
    roles: ["brand", "display", "body"],
    cssUrl:
      "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap",
    reason: "光学字号让大标题和正文呈现不同的细节密度，适合编辑型英文和数字。",
    characteristics: ["衬线", "光学字号", "编辑感"],
  },
  {
    id: "instrument-serif",
    family: "Instrument Serif",
    label: "Instrument Serif",
    source: "Google Fonts",
    license: "OFL-1.1",
    languages: ["Latin"],
    roles: ["brand", "display"],
    cssUrl:
      "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap",
    reason: "笔画对比鲜明，能让品牌字和短标题形成记忆点，不建议承担长篇正文。",
    characteristics: ["展示", "高对比", "品牌"],
  },
  {
    id: "dm-sans",
    family: "DM Sans",
    label: "DM Sans",
    source: "Google Fonts",
    license: "OFL-1.1",
    languages: ["Latin"],
    roles: ["ui", "body"],
    cssUrl:
      "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap",
    reason: "开放字腔和稳定字宽适合界面信息，英文缩写与数字在小字号下保持清楚。",
    characteristics: ["无衬线", "UI", "清晰"],
  },
  {
    id: "ibm-plex-mono",
    family: "IBM Plex Mono",
    label: "IBM Plex Mono",
    source: "Google Fonts",
    license: "OFL-1.1",
    languages: ["Latin"],
    roles: ["mono", "ui"],
    cssUrl:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap",
    reason: "技术感明确但不过度装饰，适合数据、参数、日期和辅助标签。",
    characteristics: ["等宽", "技术", "数据"],
  },
]

export function inferFontRole(element: HTMLElement): FontRole {
  const declaredRole = element.dataset.typeRole as FontRole | undefined
  if (declaredRole) return declaredRole

  if (element.matches("h1, h2, h3, blockquote")) return "display"
  if (element.matches("button, nav *, a")) return "ui"
  if (element.matches("code, pre, kbd")) return "mono"
  return "body"
}

export function rankFonts(role: FontRole): FontCandidate[] {
  return [...FONT_CATALOG].sort((a, b) => {
    const aRank = a.roles.indexOf(role)
    const bRank = b.roles.indexOf(role)
    const aScore = aRank === -1 ? 99 : aRank
    const bScore = bRank === -1 ? 99 : bRank
    return aScore - bScore
  })
}
