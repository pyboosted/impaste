#!/usr/bin/env bun

import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import { spawn } from "bun";

// Main async function to handle the script
async function main() {
	// Create a unique temporary file path
	const temp = `/tmp/clipboard.${randomUUID()}.png`;

	try {
		// Check if clipboard contains an image (PNG format)
		const clipInfoProcess = await spawn(["osascript", "-e", "clipboard info"]);
		const clipInfo = await new Response(clipInfoProcess.stdout).text();
		if (!clipInfo.includes("PNGf")) {
			console.error("Error: No image in clipboard");
			process.exit(1);
		}

		// AppleScript to write clipboard image to temp file
		const appleScript = `
      set theFilePath to "${temp}"
      set theFileReference to open for access theFilePath with write permission
      try
        set eof of theFileReference to 0 -- Clear file if it exists
        write (the clipboard as «class PNGf») to theFileReference
      on error errMsg
        close access theFileReference
        error errMsg
      end try
      close access theFileReference
    `;

		// Run AppleScript
		const writeProcess = spawn(["osascript", "-e", appleScript]);
		const exitCode = await writeProcess.exited;

		if (exitCode !== 0) {
			const errorOutput = await new Response(writeProcess.stderr).text();
			console.error(`Error: AppleScript failed to write image`);
			if (errorOutput) {
				console.error(`stderr: ${errorOutput.trim()}`);
			}
			process.exit(1);
		}

		// Check if temp file is valid
		const file = Bun.file(temp);
		if (file.size === 0) {
			console.error("Error: Temporary file is empty or invalid");
			process.exit(1);
		}

		// Output the temp file contents to stdout
		const buffer = await file.arrayBuffer();
		process.stdout.write(Buffer.from(buffer));
	} catch (err) {
		console.error(
			`Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
		);
		process.exit(1);
	} finally {
		// Clean up
		await fs.unlink(temp).catch(() => {}); // Ignore if file doesn't exist
	}
}

main();
