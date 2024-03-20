import path from "path";
import fsNormal from "fs";

const fs = fsNormal;

async function renameFilesInDirectory(inputFolder, outputFolder) {
	try {
		if (!fs.existsSync(outputFolder)) {
			fs.mkdirSync(outputFolder, { recursive: true });
		}

		const files = fs.readdirSync(inputFolder);

		for (const file of files) {
			const inputFilePath = path.join(inputFolder, file);
			const outputFileName = removeCharactersFromFileName(file);
			const outputFilePath = path.join(outputFolder, outputFileName);

			await fs.promises.rename(inputFilePath, outputFilePath);

			console.log(`Renamed ${file} to ${outputFileName}`);
		}

		console.log("All files renamed successfully.");
	} catch (err) {
		console.error("Error renaming files:", err);
	}
}
function removeCharactersFromFileName(fileName) {
	const index = fileName.indexOf("_");
	if (index !== -1) {
		return fileName.slice(index + 1);
	} else {
		return fileName;
	}
}

// Example usage:
const inputFolder = "./in/Names";
const outputFolder = "./out/CharacterlessNames";

renameFilesInDirectory(inputFolder, outputFolder);
