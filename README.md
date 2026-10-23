# Pola Harsha — Portfolio

A PCB-themed personal portfolio for an ECE student aiming to become a **Design Verification Engineer**.
Built with plain HTML, CSS and JavaScript. No frameworks, no libraries, no API calls. It works offline.

## Features

- **PCB background**: a drawn circuit-board layout (ICs, resistors, capacitors, traces, vias) with slow green signal lights
- **Verification section**: a mini testbench simulation (with a "bug injection" switch) and a Verilog bug hunt
- **3D Chip Anatomy**: an exploded IC you can pull apart with a slider
- **Solder mask switch**: toggle between a green board and a white board
- Sections: About, Verification, 3D Chip, Projects, Skills, Experience, Achievements, Education, Beyond Tech, Connect

## Folder structure

```
portfolio/
├── index.html   → page content (sections, text, links)
├── style.css    → all styling and colours
├── script.js    → background, animations, simulations
└── README.md
```

## How to run

1. Keep the three files in the same folder.
2. Double-click `index.html`.

Optional local server:

```
python -m http.server
```

Then open `http://localhost:8000`.

## How to edit

Each file has a table of contents at the top. Search for the section name to jump to it.

| I want to change…          | File         | Search for                    |
|----------------------------|--------------|-------------------------------|
| Text, links, projects      | `index.html` | the section comment, e.g. `<!-- PROJECTS -->` |
| Status register rows       | `index.html` | `status register`             |
| Verification roadmap       | `index.html` | `verification roadmap`        |
| Colours                    | `style.css`  | `VARIABLES & RESET`           |
| Background light speed     | `script.js`  | `PULSE_SPEED`                 |
| Number of moving lights    | `script.js`  | `PULSE_SHARE`                 |
| Hero typing lines          | `script.js`  | `5. TYPEWRITER`               |
| Chip layer descriptions    | `script.js`  | `8. CHIP ANATOMY`             |

Values marked `// ← EDIT` in `script.js` are safe to change.

## Publish on GitHub Pages

1. Create a GitHub repository and upload the three files.
2. Go to **Settings → Pages**.
3. Under *Branch*, select `main` and `/ (root)`, then save.
4. Your site goes live at `https://<username>.github.io/<repo>/`.

## Planned next

- Two big verification projects (bus protocol IP with UVM, RISC-V core verification)
- Bug Diary and learning log
- Waveform view and resume PDF button

## Contact

- GitHub: [polaharshavardhan455](https://github.com/polaharshavardhan455)
- LinkedIn: [Harsha Vardhan Pola](https://www.linkedin.com/in/harsha-vardhan-pola-7824b429b/)
- Email: polaharshavardhan455@gmail.com