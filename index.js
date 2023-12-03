import { exec as execCallback } from "child_process";
import fs from "fs/promises";
import fsNormal from "fs";
import util from "util";
import seedrandom from "seedrandom";

const exec = util.promisify(execCallback);

const run = async () => {
	const inFolder = "./in";
	const inFiles = await fs.readdir(inFolder);
	inFiles
		.filter((h) => h.endsWith(".wav"))
		.forEach(async (inFile) => {
			const inFilename = inFile.split(".")[0];

			const outFolder = await deleteOldAndCreateNewFolder(`./out${inFilename}`);

			const paddedOutFolder = await deleteOldAndCreateNewFolder(
				`./final/out-pad${inFilename}`
			);

			const com = await exec(
				`sox "${inFolder}/${inFilename}.wav" "${outFolder}/outfile.wav" silence  1 2 0.5% 2 0.5 0.5% : newfile : restart `
			);
			const startingNumber = Number(inFilename.split("-")[0]);
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
			if (fsNormal.existsSync(outFolder)) await fs.rm(outFolder, { recursive: true });
		});
};
run();

const deleteOldAndCreateNewFolder = async (folderName) => {
	if (fsNormal.existsSync(folderName)) await fs.rm(folderName, { recursive: true });
	if (!fsNormal.existsSync(folderName)) await fs.mkdir(folderName);
	return folderName;
};

const generateRandomPadding = (rng) => {
	const randomValue = Math.round((rng() * 0.3 + 0.4) * 1000) / 1000;
	return randomValue;
};
