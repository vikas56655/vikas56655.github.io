<div align="center">

# Vikas Singh
### Data Science · Machine Learning · AI

**A personal portfolio of projects, experiments, and technical writing.**

[**Explore the website**](https://vikas56655.github.io/) · [**Projects**](https://vikas56655.github.io/projects/) · [**GitHub**](https://github.com/vikas56655) · [**LinkedIn**](https://www.linkedin.com/in/vikas-singh-it/)

</div>

---

## About this website

This is the source repository for my personal portfolio, built to share hands-on work in data science, machine learning, and intelligent systems.

The design is intentionally simple: native system typography, generous whitespace, responsive project cards, and visual thumbnails that let the work speak for itself.

**Live site:** https://vikas56655.github.io/

## Featured projects

| Project | Focus | Repository |
| :--- | :--- | :--- |
| **GoEmotions Analysis** | Multi-label emotion recognition, NLP, model evaluation, and visual exploration | [Source code](https://github.com/vikas56655/goemotions-analysis) |
| **DS Research Agent** | LLM-powered assistance for dataset exploration, analytical workflows, and structured reports | [Source code](https://github.com/vikas56655/DS-Research-Agent) |
| **Dortmund Smart City Predictor** | Air-quality forecasting using weather data and machine-learning models | [Source code](https://github.com/vikas56655/dortmund-smart-city-predictor) |
| **SRV ToneLab** | Experimental audio analysis, guitar-inspired synthesis, spectrograms, and pitch tracking | [Source code](https://github.com/vikas56655/srv-tonelab) |

> **SRV ToneLab** is a personal music-technology experiment inspired by Stevie Ray Vaughan. Its signal-processing methods are exploratory; validated bend and vibrato classification is future research, not a current feature.

Browse all four projects and their thumbnails on the [Projects page](https://vikas56655.github.io/projects/).

## Website design

- **Minimalist visual language:** Apple-inspired system font stack, restrained color, and readable typography.
- **Responsive gallery:** three project cards per row on desktop, adapting to smaller screens.
- **Project-first navigation:** quick access to source repositories and concise summaries.
- **Custom visual assets:** including artwork for Dortmund Smart City Predictor and SRV ToneLab.
- **Static architecture:** HTML, CSS, and a small amount of JavaScript, served through GitHub Pages.

## Site structure

```text
.
├── index.html               # Homepage
├── projects/index.html      # Featured project gallery
├── blog/index.html          # Blog landing page
├── publications/index.html  # Publications
├── cv/index.html            # CV
├── notes/index.html         # Notes
├── smart-city/              # Smart-city visualization page
├── assets/
│   ├── css/style.css        # Shared styling and responsive layouts
│   └── images/              # Website and project artwork
├── favicon.svg
└── README.md
```

## Run locally

The portfolio is a static website; **no build step, API key, or package installation is required** for the main pages.

Clone the repository:

```bash
git clone https://github.com/vikas56655/vikas56655.github.io.git
cd vikas56655.github.io
```

To serve it from the repository root:

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000). Running a local server is preferable to opening the HTML files directly because the site uses root-relative asset paths.

## Tools and interests

My work spans **Python, SQL, machine learning, natural language processing, data visualization, Power BI, and AWS**. Individual project repositories document their own dependencies, implementation details, and current capabilities.

## Contact

For collaboration or questions, connect through [my website](https://vikas56655.github.io/) or [LinkedIn](https://www.linkedin.com/in/vikas-singh-it/).

---

<sub>© 2026 Vikas Singh. Portfolio design adapted from <a href="https://github.com/academicpages/academicpages.github.io">AcademicPages</a>, based on <a href="https://github.com/mmistakes/minimal-mistakes">Minimal Mistakes</a>.</sub>
