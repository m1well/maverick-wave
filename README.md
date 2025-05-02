# MaverickWave

&#x20;

A lightweight, modern CSS framework for building responsive websites with elegance and speed. MaverickWave provides a clean foundation with a streamlined approach, suitable for projects ranging from personal portfolios to corporate websites and e-commerce platforms.

While AI tools helped kickstart the development of some components and provided initial structure, approximately 80% of the codebase required manual refinement and customization. The framework has been meticulously crafted to ensure:

- Consistent implementation of custom variables throughout the system
- Proper integration between components and logical SCSS structure
- Optimized specificity and selector hierarchy
- Reliable responsive behavior across devices
- Built-in dark mode support and accessibility considerations

The result is a framework that balances utility with simplicity, offering developers a solid foundation that can be easily customized.

➡️ [**View the Live Showcase & Documentation**](https://maverick-wave.m1well.com)

## Features

- Responsive Grid System
- Comprehensive set of UI Components (Buttons, Cards, Avatars, Tabs, etc.)
- Utility-First Classes for rapid development
- Easy Customization via CSS Variables
- Built-in Light & Dark Mode support
- SCSS Source Files available for advanced customization
- Minimal JavaScript footprint

## Installation & Usage

Choose the method that best suits your project:

### 1. Using npm (currently not available!!!)

Install the package:

```bash
npm install maverick-wave
```

Include in your project:

**CSS:**

```javascript
// Example in main JS file (React, Vue, etc.)
import 'maverick-wave/dist/maverick-wave.min.css';
```

```css
/* Example in main CSS/SCSS file */
@import 'node_modules/maverick-wave/dist/maverick-wave.min.css';
```

**SCSS (Recommended for customization):**

```scss
// Override variables if needed *before* importing
// $primary-color: #your-color;

@import 'node_modules/maverick-wave/scss/main.scss';
```

**JavaScript (Optional):**

```javascript
import 'maverick-wave/dist/maverick-wave.min.js';
// Or include via <script> tag (see below)
```

### 2. Using CDN (jsDelivr)

Include the CSS and JS files directly in your HTML:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My MaverickWave Project</title>
    <!-- Replace @latest with a specific version (e.g., @v1.0.0) -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/maverick-wave@latest/dist/maverick-wave.min.css"
    />
  </head>
  <body>
    <!-- Your content here -->

    <script src="https://cdn.jsdelivr.net/npm/maverick-wave@latest/dist/maverick-wave.min.js"></script>
  </body>
</html>
```

**Note:** Always use a specific version tag (e.g., `@1.0.0`) instead of `@latest` in production for stability.

### 3. Direct Download

Download the `maverick-wave.min.css` and `maverick-wave.min.js` files from the latest release and include them manually:

```html
<link rel="stylesheet" href="path/to/maverick-wave.min.css" />
<script src="path/to/maverick-wave.min.js"></script>
```

## Customization

MaverickWave is built with CSS custom properties, making customization simple.

Example:

```css
:root {
  --mw-primary-color: #your-brand-color;
  --mw-secondary-color: #your-secondary-color;
  /* and other colors.... */
  --mw-font-family-base: 'Your Font Name', sans-serif;
}
```

For deeper customization, import the SCSS source files (via npm) and modify the SCSS variables before the `@import` statement.

## Development (Contributing)

This section is for those who want to contribute to the MaverickWave framework itself.

### Prerequisites

- Node.js (v14 or newer recommended)
- npm
- Git

### Setup

Clone the repository:

```bash
git clone https://github.com/m1well/maverick-wave.git
cd maverick-wave
```

Install dependencies:

```bash
npm install
```

### Development Commands

**Run the Showcase:**

```bash
npm run start # to start the gulp watcher
npm run showcase # to start the http-server for the dist folder
```

Access at `http://localhost:8888`.

**Build the Framework:**

```bash
npm run build
```

Compiles SCSS/JS and builds the showcase HTML into `/dist/`.

**Format Code:**

```bash
npm run format
```

Formats code using Prettier.

## Project Structure

```
maverick-wave/
├── dist/                   # Compiled CSS/JS files and showcase HTML
├── src/                    # Source files
│   ├── assets/             # Logos, favicons, etc.
│   ├── js/                 # JavaScript source files
│   ├── partials/           # HTML partials for the showcase
│   ├── scss/               # SCSS source files
│   │    ├── abstracts/     # Variables, mixins, functions
│   │    ├── base/          # Base styles, reset, typography
│   │    ├── components/    # Individual component styles
│   │    ├── layout/        # Containers, Grid, Header, Footer
│   │    ├── utilities/     # Utility classes
│   │    └── main.scss      # Main SCSS entry point
├── .prettierrc.json        # Prettier configuration
├── gulpfile.js             # Gulp tasks configuration
├── index.html              # Showcase entry HTML
├── package.json            # Project configuration
├── README.md               # This file
└── release.sh              # Create a release (only for the author!)
```

## Contribution

Contributions are welcome! Please ensure your code is clean and consistent.

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Make your changes.
4. Format the code (`npm run format`).
5. Commit using Conventional Commits format (e.g., `feat: add new button component`).
6. Push your branch and create a Pull Request.

## License

This project is licensed under the MIT License.

## Author

Created by [m1well](https://m1well.com)
