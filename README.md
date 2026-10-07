# Infinite Image Carousel (React + TypeScript)

A reusable infinite image carousel built with React and TypeScript.

## Features

- Infinite scrolling in both directions
- Mouse wheel and native horizontal scrolling
- Responsive layout for desktop and mobile
- Virtualized rendering for large image collections
- Small rendering window instead of rendering the entire image dataset
- Lazy-loaded images
- Type-safe React components
- No navigation buttons

## Run locally

Install dependencies: 

npm install

Start the dev server:

npm run dev

## Implementation

The example uses 1000 images from Picsum.

The carousel keeps the full image collection as data but renders only a small window of images at a time. Buffer images are rendered on both sides of the visible area, and the window is shifted as the user scrolls.

Circular indexing allows scrolling continuously in both directions, while scroll position compensation keeps the transition visually seamless.
