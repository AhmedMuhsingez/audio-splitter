import fs from "fs/promises";
import path from "path";

const inFolder = "./in/names";

const processFiles = async () => {
	try {
		const inFiles = await fs.readdir(inFolder);

		for (const inFile of inFiles) {
			const inFilePath = path.join(inFolder, inFile);
			const inFilename = path.parse(inFile).name;

			// Subtract 1 from the filename
			const newFilename = parseInt(inFilename, 10) - 1;

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
