
## SVG to PNG
inkscape -z -e icon-72x72.png -w 72 -h 72 icon.svg

## PNG to ico
convert icon-512x512.png -define icon:auto-resize=64,48,32,16 favicon.ico