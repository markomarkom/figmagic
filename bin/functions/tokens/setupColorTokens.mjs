import { camelize } from '../helpers/camelize.mjs';
import { roundColorValue } from '../helpers/roundColorValue.mjs';
import { formatName } from '../helpers/formatName.mjs';

import {
  errorSetupColorTokensNoFrame,
  errorSetupColorTokensNoChildren,
  errorSetupColorTokensNoFills
} from '../../meta/errors.mjs';

/**
 * Places all Figma color frames into a clean object
 *
 * @exports
 * @function
 * @param {object} colorFrame - The color frame from Figma
 * @returns {object} - Returns an object with all the colors
 * @throws {errorSetupColorTokensNoFrame} - When there is no provided Figma frame
 * @throws {errorSetupColorTokensNoChildren} - When Figma frame is missing children
 */
export function setupColorTokens(colorFrame) {
  if (!colorFrame) throw new Error(errorSetupColorTokensNoFrame);
  if (!colorFrame.children) throw new Error(errorSetupColorTokensNoChildren);

  let colors = {};

  colorFrame.children.forEach(color => {
    if (!color.fills) throw new Error(errorSetupColorTokensNoFills);
    /*
    if (!color.fills[0]) throw new Error(errorSetupColorTokensNoFills);
    if (!color.fills[0].color) throw new Error(errorSetupColorTokensNoFills);
    if (!color.fills[0].color.r) throw new Error(errorSetupColorTokensNoFills);
    if (!color.fills[0].color.g) throw new Error(errorSetupColorTokensNoFills);
		if (!color.fills[0].color.b) throw new Error(errorSetupColorTokensNoFills);
		*/

    const COLOR_STRING = `rgba(${roundColorValue(color.fills[0].color.r, 255)}, ${roundColorValue(
      color.fills[0].color.g,
      255
    )}, ${roundColorValue(color.fills[0].color.b, 255)}, ${roundColorValue(
      color.fills[0].color.a,
      1
    )})`;

    let normalizedName = camelize(color.name);
    normalizedName = formatName(normalizedName);
    colors[normalizedName] = COLOR_STRING;
  });

  return colors;
}
