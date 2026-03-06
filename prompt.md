Here is a **high-quality prompt you can give to an AI coding tool (like GitHub Copilot or Cursor)** to generate a **modern interactive website for your package**.
It uses **the second image style (OpenAI-like UI)** for the frontend and includes instructions for creating a **blog documentation page**.

---

# Full Prompt for Building the Website

**Prompt:**

Create a **modern, interactive, and dynamic developer website** for a Python AI/AutoML package called **TrainIQ**. The website should follow the clean and minimal design style similar to the official platform page of OpenAI shown in the second image. The frontend must use a **dark theme with large typography, smooth animations, and modern layout components**. Use **React with Next.js for the frontend framework**, styled with **TailwindCSS** for rapid UI design, and integrate **Framer Motion for smooth animations and transitions**. The landing page should have a **hero section with a bold headline** such as “Build Intelligent ML Pipelines with TrainIQ,” a short description explaining that TrainIQ is an AutoML library capable of dataset analysis, model selection, hyperparameter tuning, and web research automation, and two call-to-action buttons: “Start Building” and “View Documentation.” Below the hero section add **trusted developer logos and use cases**, similar to the OpenAI layout, followed by sections describing the key features of TrainIQ such as Automatic Dataset Intelligence, One-Line Model Training, Natural Language ML Pipelines, Web Research Engine, and Deployment Automation. Include smooth scroll navigation and animated feature cards.

The website must contain the following pages and components:

1. **Home Page**

   * Hero section with large centered heading and background animation
   * Feature grid with animated cards
   * Code snippet examples showing how to use TrainIQ
   * Integration section showing compatibility with Python ML tools
   * Call-to-action section encouraging users to install the package via pip

2. **Documentation Page**

   * Left sidebar navigation similar to developer documentation sites
   * Sections such as Installation, Quick Start, API Reference, and Examples
   * Code blocks showing how to run TrainIQ commands
   * Search functionality for documentation pages

3. **Interactive Demo Section**

   * Provide a small UI where a user can type a prompt like “train model on dataset.csv”
   * Display example outputs and workflow visualization

4. **Blog Page (Important)**
   Create a dedicated **Blog / Tutorials section** where developers can read **step-by-step guides for using TrainIQ**.
   Each blog article must include:

   * Title and author information
   * Table of contents
   * Step-by-step instructions with code snippets
   * Images or diagrams explaining workflows
   * Code examples in Python
   * Estimated reading time
   * Tags like AutoML, Machine Learning, AI Tools

   Example blog topics:

   * “Getting Started with TrainIQ in 10 Minutes”
   * “Building an AutoML Pipeline with One Line of Code”
   * “Using the WebResearch Engine for AI-Powered Data Discovery”
   * “Deploying ML Models with TrainIQ”

   Implement blog pages using **Markdown or MDX files stored in a `/blog` directory**, automatically rendered by the Next.js framework so new blog posts can be added easily without changing the main codebase.

5. **Navigation and Layout**

   * Sticky top navigation bar with links: Home, Docs, Blog, GitHub
   * Mobile-responsive hamburger menu
   * Dark modern UI similar to OpenAI developer pages
   * Footer containing links to documentation, GitHub repository, and community channels

6. **Animations and UX**

   * Smooth scrolling between sections
   * Hover animations for feature cards
   * Animated code blocks or typing effect in the hero section
   * Background gradient or particle animation similar to modern AI websites

7. **Performance and SEO**

   * Optimize images and components for fast loading
   * Add metadata for search engines
   * Support static site generation with Next.js

8. **Developer Friendly Structure**

Project structure should look like:

```
/trainiq-website
   /components
   /pages
      index.tsx
      docs.tsx
      blog.tsx
   /blog
      getting-started.mdx
      automl-guide.mdx
   /styles
   /public
```

Ensure the website is **fully responsive, developer-focused, and visually impressive**, combining the **clean minimal design of the OpenAI platform page with modern interactive animations**.

---

💡 **Suggestion for you (Girish):**
If you want this website to look **really premium**, I can also show you **3 specific UI features used by top AI websites (OpenAI, Anthropic, Vercel)** that make the site look **10× more professional**.
