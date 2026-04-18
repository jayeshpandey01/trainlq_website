### **1. Website Updates (Single Unified Site)**

- **Integrate copys + cmd_d (coming soon) into one website**
    - Connect everything under one domain/app (no separate pages).
    - "copys" → assumed as code-copy/share/export feature (e.g., one-click copy of training code, model export, or dataset copies).
    - "cmd_d" → Command Dashboard (interactive terminal-like UI for running library commands directly in browser).
    - Implementation: Use **FastAPI + React/Next.js** (or Streamlit/Gradio if you want quick Python-only frontend). Expose library functions via REST/WebSocket API. cmd_d can use xterm.js for real terminal feel.
- **Make it fully mobile-friendly (responsive + PWA)**
    - Use Tailwind CSS + mobile-first design.
    - Add touch-friendly controls, collapsible sidebars, and offline caching (PWA manifest + service worker).
    - Test with Chrome DevTools device emulation + real Android/iOS devices.
    - New addition: Dark mode + one-tap "Run Training" buttons optimized for mobile data usage.
- **Update blog automatically according to library changes**
    - Whenever you update model_training / search_search / query_train, auto-generate blog posts (Markdown) using the library's own LLM.
    - Add changelog section on blog homepage that pulls latest git commits + library version.
    - Bonus: RSS feed + email subscription for users.

**New performance-focused website additions**

- Add live demo section where visitors can try query_train("train cancer model") directly in browser (powered by your library backend).
- Model gallery: Show trained cancer models with metrics, SHAP explanations, and downloadable ONNX files.ve