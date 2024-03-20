import { exec as execCallback } from "child_process";
import fs from "fs/promises";
import fsNormal from "fs";
import util from "util";
import seedrandom from "seedrandom";
import promptSync from "prompt-sync";
const prompt = promptSync();
const startingNumber = parseInt(prompt("Enter starting number of the files: "), 10);

const exec = util.promisify(execCallback);
const deleteOldAndCreateNewFolder = async (folderName) => {
	if (fsNormal.existsSync(folderName)) await fs.rm(folderName, { recursive: true });
	if (!fsNormal.existsSync(folderName)) await fs.mkdir(folderName);
	return folderName;
};

const generateRandomPadding = (rng) => {
	const randomValue = Math.round((rng() * 0.3 + 0.4) * 1000) / 1000;
	return randomValue;
};

const run = async () => {
	const inFolder = "./in";
	const inFiles = await fs.readdir(inFolder);
	inFiles
		.filter((h) => h.endsWith(".wav"))
		.forEach(async (inFile) => {
			const inFilename = inFile.split(".")[0];

			const outFolder = await deleteOldAndCreateNewFolder(`./out/out-needsPadding`);

			const paddedOutFolder = await deleteOldAndCreateNewFolder(
				`./out/out-padded-${inFilename}`
			);

			const com = await exec(
				`sox "${inFolder}/${inFilename}.wav" "${outFolder}/notPadded.wav" silence  1 2 0.5% 2 0.5 0.5% : newfile : restart `
			);
			// const startingNumber = Number(inFilename.split("-")[0]);

			//Number/Name of the first file and how it starts:
			const outFiles = await fs.readdir(outFolder);
			await Promise.all(
				outFiles.map(async (outFile, outIndex) => {
					const rng = seedrandom(outFile + inFilename);
					const randomBeforePadding = generateRandomPadding(rng);
					const randomAfterPadding = generateRandomPadding(rng);

					const pad = await exec(
						`sox ${outFolder}/${outFile} ${paddedOutFolder}/${
							startingNumber + outIndex
						}.wav pad ${randomBeforePadding} ${randomAfterPadding}`
					);
				})
			);
			console.log(`Processing of splitting and padding ${inFile} complete.`);
			if (fsNormal.existsSync(outFolder)) await fs.rm(outFolder, { recursive: true });
		});
};
run();
