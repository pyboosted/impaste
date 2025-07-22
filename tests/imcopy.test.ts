import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { spawn } from "bun";

test("imcopy should copy image to clipboard", async () => {
	// Read the example image
	const imagePath = "./demo/example.png";
	const imageData = readFileSync(imagePath);

	// Clear clipboard first
	const clearProcess = await spawn([
		"osascript",
		"-e",
		'set the clipboard to ""',
	]);
	await clearProcess.exited;

	// Copy image to clipboard using imcopy
	const copyProcess = spawn(["bun", "./imcopy.ts"], {
		stdin: "pipe",
	});

	copyProcess.stdin?.write(imageData);
	copyProcess.stdin?.end();

	const exitCode = await copyProcess.exited;
	expect(exitCode).toBe(0);

	// Verify clipboard contains an image
	const verifyProcess = await spawn(["osascript", "-e", "clipboard info"]);
	const clipInfo = await new Response(verifyProcess.stdout).text();

	expect(clipInfo).toContain("PNGf");
});
