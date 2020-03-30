import { colors } from './colors.mjs';

export const msgDownloadFileWritingFile = path => `${colors.FgYellow}\n* Writing file: ${path}`;
export const msgGeneratedFileWarning = `THIS FILE IS AUTO-GENERATED BY FIGMAGIC. DO NOT MAKE EDITS IN THIS FILE! CHANGES WILL GET OVER-WRITTEN BY ANY FURTHER PROCESSING.`;
export const msgGetTokenMatchNoMatch = `${colors.FgYellow}\n! No matching token! Hard-coding to expected value:`;
export const msgJobComplete = `${colors.FgGreen}\nFigmagic completed operations successfully!`;
export const msgProcessElementsCreatingElement = (elementName, fixedName) =>
  `* ${elementName} > ${fixedName}`;
export const msgSetDataFromApi = `${colors.FgYellow}\nAttempting to fetch data from Figma API...\n`;
export const msgSetDataFromLocal = `${colors.FgYellow}\nAttempting to recompile data from local Figma JSON file...\n`;
export const msgSyncElements = `${colors.FgYellow}\nAttempting to parse elements...\n`;
export const msgSyncGraphics = `${colors.FgYellow}\nGetting images from Figma API...\n`;
export const msgWriteBaseFile = `${colors.FgYellow}\nWriting Figma base file...\n`;
export const msgWriteTokens = `${colors.FgYellow}\nWriting design tokens...\n`;
