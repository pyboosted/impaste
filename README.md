# @hexie/impaste

macOS command-line tools for clipboard image manipulation. Copy and paste PNG images using the terminal.

## Features

- 🖼️ **impaste** - Extract PNG images from clipboard to stdout
- 📋 **imcopy** - Copy PNG images from stdin to clipboard
- 🚀 Fast and lightweight, powered by Bun
- 🔧 Unix-style tools that work great in pipes
- 🎯 Zero runtime dependencies

## Installation

```bash
npm install -g @hexie/impaste
```

Or with Bun:

```bash
bun install -g @hexie/impaste
```

## Usage

### Basic Commands

```bash
# Copy an image to clipboard
imcopy < image.png

# Paste image from clipboard to file
impaste > output.png

# Copy image from URL to clipboard (using curl)
curl -s https://example.com/image.png | imcopy
```

### Advanced Examples

```bash
# Process clipboard image with ImageMagick and copy back
impaste | convert - -resize 50% - | imcopy

# Save clipboard image with timestamp
impaste > "screenshot_$(date +%Y%m%d_%H%M%S).png"

# Copy processed image to clipboard
cat photo.png | convert - -grayscale average - | imcopy
```

## Requirements

- macOS (uses AppleScript for clipboard access)
- Bun runtime (for development)

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/hexie/impaste.git
cd impaste

# Install dependencies
bun install
```

### Commands

```bash
# Run tests
bun test

# Lint code
bun run lint

# Format code
bun run format

# Type check
bun run typecheck
```

### Testing Locally

```bash
# Test imcopy
cat demo/example.png | bun ./imcopy.ts

# Test impaste
bun ./index.ts > test-output.png
```

## How It Works

Both tools use macOS's built-in AppleScript capabilities to interact with the system clipboard:

- **impaste**: Checks if the clipboard contains a PNG image, writes it to a temporary file, then outputs the contents to stdout
- **imcopy**: Reads image data from stdin, writes it to a temporary file, then uses AppleScript to copy it to the clipboard

The tools handle PNG format specifically (`«class PNGf»` in AppleScript) and include comprehensive error handling for common scenarios.

## Error Handling

The tools provide clear error messages for common issues:

- No image in clipboard (impaste)
- No input data provided (imcopy)
- Invalid image format
- AppleScript execution failures

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

Built with [Bun](https://bun.sh) - a fast all-in-one JavaScript runtime.
