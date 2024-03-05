import fs from "fs/promises";
import path from "path";
import fsNormal from "fs";

// import { readLine } from "readline";
// import * as readline from "node:readline/promises";
import promptSync from "prompt-sync";
const prompt = promptSync();

const inFolder = "./in/names";

const processFiles = async () => {
	const amount = prompt("Enter subtraction amount: ");
	try {
		const inFiles = await fs.readdir(inFolder);

		for (const inFile of inFiles) {
			const inFilePath = path.join(inFolder, inFile);
			const inFilename = path.parse(inFile).name;

			// Subtract 1 from the filename
			const newFilename = parseInt(inFilename, 10) - amount;
			if (!fsNormal.existsSync("./out/newNames")) await fs.mkdir("./out/newNames");

			// Create the output file path
			const outFilePath = path.join(
				"./out/newNames",
				`${newFilename}${path.extname(inFile)}`
			);

			console.log(`Processing ${inFile}. Renaming to ${path.basename(outFilePath)}`);

			// Rename the file
			await fs.rename(inFilePath, outFilePath);

			console.log(`Processing of ${inFile} complete.`);
		}
	} catch (error) {
		console.error("Error:", error);
	}
};

// Call the function
processFiles();
