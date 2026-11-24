import re
import os

BASE_DIR = r"C:\Users\agrim\.gemini\antigravity\scratch\drive-shield\site"
INDEX_PATH = os.path.join(BASE_DIR, "index.html")
OUTPUT_PATH = os.path.join(BASE_DIR, "standalone.html")

css_files = [
    "css/tokens.css",
    "css/base.css",
    "css/layout.css",
    "css/components.css",
    "css/demo.css",
    "css/hud.css",
]

# Read and combine CSS
combined_css = []
for rel in css_files:
    p = os.path.join(BASE_DIR, rel.replace("/", os.sep))
    with open(p, "r", encoding="utf-8") as f:
        combined_css.append(f"/* === {rel} === */\n" + f.read())

full_css = "\n\n".join(combined_css)

# Read JS in dependency order and strip export/import
js_files = [
    "js/config.js",
    "js/demo/audio.js",
    "js/demo/engine.js",
    "js/demo/renderer.js",
    "js/demo/controller.js",
    "js/particles.js",
    "js/hud-effects.js",
    "js/ttc-slider.js",
    "js/sensor-hotspots.js",
    "js/filter-grid.js",
    "js/accordion.js",
    "js/buy-menu.js",
    "js/main.js",
]

combined_js = []
for rel in js_files:
    p = os.path.join(BASE_DIR, rel.replace("/", os.sep))
    with open(p, "r", encoding="utf-8") as f:
        content = f.read()
        # Remove import statements
        content = re.sub(r'import\s+[^;]+;\n?', '', content)
        # Remove 'export default '
        content = re.sub(r'export\s+default\s+', '', content)
        # Remove 'export const ' -> 'const '
        content = re.sub(r'export\s+const\s+', 'const ', content)
        # Remove 'export function ' -> 'function '
        content = re.sub(r'export\s+function\s+', 'function ', content)
        # Remove 'export class ' -> 'class '
        content = re.sub(r'export\s+class\s+', 'class ', content)
        # Remove 'export let ' -> 'let '
        content = re.sub(r'export\s+let\s+', 'let ', content)
        # Remove 'export var ' -> 'var '
        content = re.sub(r'export\s+var\s+', 'var ', content)
        combined_js.append(f"// === {rel} ===\n" + content)

full_js = "\n\n".join(combined_js)

# Read index.html
with open(INDEX_PATH, "r", encoding="utf-8") as f:
    html = f.read()

# Inline logo.png as base64 data URI so it loads unconditionally in any iframe/srcdoc
logo_path = os.path.join(BASE_DIR, "assets", "logo.png")
if os.path.exists(logo_path):
    import base64
    with open(logo_path, "rb") as lf:
        logo_b64 = base64.b64encode(lf.read()).decode("utf-8")
    html = html.replace('src="assets/logo.png"', f'src="data:image/png;base64,{logo_b64}"')

# Remove external stylesheet links
html = re.sub(r'<link\s+rel="stylesheet"\s+href="css/[^"]+">\s*', '', html)

# Inject inline style before </head>
style_block = f"<style>\n{full_css}\n</style>\n</head>"
html = html.replace("</head>", style_block, 1)

# Remove script module tag
html = re.sub(r'<script\s+type="module"\s+src="js/main\.js"></script>', '', html)

# Inject inline script before </body>
script_block = f"<script>\n{full_js}\n</script>\n</body>"
html = html.replace("</body>", script_block, 1)

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    f.write(html)

print(f"Generated standalone HTML: {OUTPUT_PATH} ({len(html)} characters)")
