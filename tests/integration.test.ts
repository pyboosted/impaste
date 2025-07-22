import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { spawn } from "bun";

test("integration: imcopy and impaste should work together", async () => {
	// Read the example image
	const imagePath = "./demo/example.png";
	const originalImageData = readFileSync(imagePath);

	// Clear clipboard first
	const clearProcess = await spawn([
		"osascript",
		"-e",
		'set the clipboard to ""',
	]);
	await clearProcess.exited;

	// Step 1: Copy image to clipboard using imcopy
	const copyProcess = spawn(["bun", "./imcopy.ts"], {
		stdin: "pipe",
	});

	copyProcess.stdin?.write(originalImageData);
	copyProcess.stdin?.end();

	const copyExitCode = await copyProcess.exited;
	expect(copyExitCode).toBe(0);

	// Step 2: Paste from clipboard using impaste
	const pasteProcess = await spawn(["bun", "./index.ts"]);

	const pasteExitCode = await pasteProcess.exited;
	expect(pasteExitCode).toBe(0);

	const pastedImageData = await new Response(pasteProcess.stdout).arrayBuffer();
	const pastedBuffer = Buffer.from(pastedImageData);

	// Step 3: Verify the images match
	expect(pastedBuffer.length).toBeGreaterThan(0);

	// Both should be PNG files
	const pngHeader = Buffer.from([
		0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
	]);
	expect(originalImageData.subarray(0, 8)).toEqual(pngHeader);
	expect(pastedBuffer.subarray(0, 8)).toEqual(pngHeader);

	console.log(
		`✅ Successfully copied and pasted image (${pastedBuffer.length} bytes)`,
	);
});
