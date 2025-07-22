#!/usr/bin/env bun

import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import { spawn } from "bun";

async function main() {
	const temp = `/tmp/clipboard.${randomUUID()}.png`;

	try {
		// Read image data from stdin
		const chunks: Buffer[] = [];
		for await (const chunk of process.stdin) {
			chunks.push(chunk);
		}
		const imageData = Buffer.concat(chunks);

		if (imageData.length === 0) {
			console.error("Error: No image data received from stdin");
			process.exit(1);
		}

		// Write to temporary file
		await fs.writeFile(temp, imageData);

		// Use the exact working format from our test
		const copyProcess = spawn([
			"osascript",
			"-e",
			`set the clipboard to (read POSIX file "${temp}" as «class PNGf»)`,
		]);

		// Wait for the process to complete
		const exitCode = await copyProcess.exited;

		if (exitCode !== 0) {
			const errorOutput = await new Response(copyProcess.stderr).text();
			const output = await new Response(copyProcess.stdout).text();

			console.error(`Error: Failed to copy image to clipboard`);
			if (errorOutput) {
				console.error(`stderr: ${errorOutput.trim()}`);
			}
			if (output) {
				console.error(`stdout: ${output.trim()}`);
			}
			console.error(`Exit code: ${exitCode}`);
			process.exit(1);
		}
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
