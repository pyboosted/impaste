import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { spawn } from "bun";

test("impaste should paste image from clipboard", async () => {
	// First, copy the example image to clipboard
	const imagePath = "./demo/example.png";
	const originalImageData = readFileSync(imagePath);

	// Copy image to clipboard using imcopy
	const copyProcess = spawn(["bun", "./imcopy.ts"], {
		stdin: "pipe",
	});

	copyProcess.stdin?.write(originalImageData);
	copyProcess.stdin?.end();

	await copyProcess.exited;

	// Now paste from clipboard using impaste
	const pasteProcess = await spawn(["bun", "./index.ts"]);

	const exitCode = await pasteProcess.exited;
	expect(exitCode).toBe(0);

	// Read the pasted image data
	const pastedImageData = await new Response(pasteProcess.stdout).arrayBuffer();
	const pastedBuffer = Buffer.from(pastedImageData);

	// Verify the pasted image is not empty
	expect(pastedBuffer.length).toBeGreaterThan(0);

	// Verify it's a PNG (check PNG header)
	const pngHeader = Buffer.from([
		0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
	]);
	expect(pastedBuffer.subarray(0, 8)).toEqual(pngHeader);
});
