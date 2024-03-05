import fs from "fs/promises";
import path from "path";
import fsNormal from "fs";
import promptSync from "prompt-sync";
const prompt = promptSync();
const inFolder = "./in/names/";
const typeOfProcess = prompt("Add or sub? (Type add/sub) ");
const amount = parseInt(prompt("Enter addition or subtraction amount: "), 10); // Parse amount as an integer

const processFiles = async () => {
	try {
		const inFiles = await fs.readdir(inFolder);

		for (const inFile of inFiles) {
			const inFilePath = path.join(inFolder, inFile);
			const inFilename = path.parse(inFile).name;
			const parsedFilename = parseInt(inFilename, 10); // Parse inFilename as an integer

			const newFilename =
				typeOfProcess === "sub"
					? parsedFilename - amount // Perform subtraction
					: parsedFilename + amount; // Perform addition
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

//Remove specific character from the file name:

// const removeTwo = path.parse(inFile).name.slice(0, -1); // Remove the last character from the file name
// const newFileName = path.join(
// 	// Create a new file name by appending the extension
// 	"./out/newNames",
// 	`${removeTwo}${path.extname(inFile)}`
// );
// if (!fsNormal.existsSync("./out/newNames")) await fs.mkdir("./out/newNames");

// console.log(`Processing ${inFile}. Renaming to ${path.basename(newFileName)}`);

// await fs.rename(inFile, newFileName); // Rename the file with the new file name

// console.log(`Processing of ${inFile} complete.`);
