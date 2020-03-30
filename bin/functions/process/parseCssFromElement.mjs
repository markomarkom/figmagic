import { roundColorValue } from '../helpers/roundColorValue.mjs';
import { getTokenMatch } from './getTokenMatch.mjs';
//import { warnParseCssFromElementNoTokenMatch } from '../meta/warnings.mjs';
import { errorParseCssFromElement } from '../../meta/errors.mjs';

/**
 * Parse layout CSS from "element" (Figma component)
 *
 * @exports
 * @async
 * @function
 * @param {object} element - Figma object representation of main layout element
 * @param {object} [textElement] - Figma object representation of the text field connected to the element/component
 * @param {number} remSize - HTML body REM size
 * @returns {object} - Returns object with CSS and imports
 * @throws {errorParseCssFromElement} - Throws error if missing element or remSize arguments
 */
export async function parseCssFromElement(element, textElement, remSize) {
  if (!element || !remSize) throw new Error(errorParseCssFromElement);

  // Dynamic imports
  const _borderWidths = await import('../../../tokens/borderWidths.mjs');
  const borderWidths = _borderWidths.default;
  const _colors = await import('../../../tokens/colors.mjs');
  const colors = _colors.default;
  const _radii = await import('../../../tokens/radii.mjs');
  const radii = _radii.default;
  const _shadows = await import('../../../tokens/shadows.mjs');
  const shadows = _shadows.default;
  const _spacing = await import('../../../tokens/spacing.mjs');
  const spacing = _spacing.default;
  // Not using media queries or Z indices

  let css = ``;
  let imports = [];

  css += `width: 100%;\n`;

  // Paddings for top and bottom
  const PADDING_Y = (() => {
    if (textElement) {
      const PARENT_HEIGHT = element.absoluteBoundingBox.height;
      const TEXT_HEIGHT = textElement.absoluteBoundingBox.height;
      const PADDING_TOP = textElement.absoluteBoundingBox.y - element.absoluteBoundingBox.y;
      const PADDING_BOTTOM = PARENT_HEIGHT - (PADDING_TOP + TEXT_HEIGHT);

      return {
        top: Math.round(PADDING_TOP),
        bottom: Math.round(PADDING_BOTTOM)
      };
    }
  })();

  // Paddings for left and right
  const PADDING_X = (() => {
    if (textElement) {
      const PARENT_WIDTH = element.absoluteBoundingBox.width;
      const TEXT_WIDTH = textElement.absoluteBoundingBox.width;
      const PADDING_LEFT = textElement.absoluteBoundingBox.x - element.absoluteBoundingBox.x;
      const PADDING_RIGHT = PARENT_WIDTH - (PADDING_LEFT + TEXT_WIDTH);

      return {
        left: Math.round(PADDING_LEFT),
        right: Math.round(PADDING_RIGHT)
      };
    }
  })();

  const PADDING = {
    ...PADDING_Y,
    ...PADDING_X
  };

  if (PADDING && Object.keys(PADDING).length > 0) {
    const PADDINGS = Object.values(PADDING).map(p => p);
    const IS_ZERO = PADDINGS.every(item => item === 0);

    // Don't set paddings if all values are actually empty
    if (!IS_ZERO) {
      const { updatedCss, updatedImports } = getTokenMatch(
        spacing,
        'spacing',
        'padding',
        PADDING,
        remSize
      );
      css += updatedCss;
      updatedImports.forEach(i => imports.push(i));
    }
  }

  const HEIGHT = (() => {
    if (element.absoluteBoundingBox) {
      return element.absoluteBoundingBox.height;
    }
  })();

  if (HEIGHT) {
    const { updatedCss, updatedImports } = getTokenMatch(
      spacing,
      'spacing',
      'height',
      HEIGHT,
      remSize
    );
    css += updatedCss;
    updatedImports.forEach(i => imports.push(i));
  }

  const BACKGROUND_COLOR = (() => {
    if (element.fills) {
      if (element.fills[0]) {
        if (element.fills[0].type === 'SOLID') {
          const R = roundColorValue(element.fills[0].color.r);
          const G = roundColorValue(element.fills[0].color.g);
          const B = roundColorValue(element.fills[0].color.b);
          const A = roundColorValue(element.fills[0].color.a, 1);
          return `rgba(${R}, ${G}, ${B}, ${A})`;
        }
      }
    }
  })();

  if (BACKGROUND_COLOR) {
    const { updatedCss, updatedImports } = getTokenMatch(
      colors,
      'colors',
      'background-color',
      BACKGROUND_COLOR,
      remSize
    );
    css += updatedCss;
    updatedImports.forEach(i => imports.push(i));
  }

  css += `border: 0;\n`;
  css += `border-style: solid;\n`;

  const BORDER_WIDTH = (() => {
    if (element.strokeWeight) {
      return `${element.strokeWeight}px`;
    }
  })();

  if (BORDER_WIDTH) {
    const { updatedCss, updatedImports } = getTokenMatch(
      borderWidths,
      'borderWidths',
      'border-width',
      BORDER_WIDTH,
      remSize
    );
    css += updatedCss;
    updatedImports.forEach(i => imports.push(i));
  }

  const BORDER_COLOR = (() => {
    if (element.strokes) {
      if (element.strokes.length > 0) {
        if (element.strokes[0].type === 'SOLID') {
          const R = roundColorValue(element.strokes[0].color.r);
          const G = roundColorValue(element.strokes[0].color.g);
          const B = roundColorValue(element.strokes[0].color.b);
          const A = roundColorValue(element.strokes[0].color.a, 1);
          return `rgba(${R}, ${G}, ${B}, ${A})`;
        }
      }
    }
  })();

  if (BORDER_COLOR) {
    const { updatedCss, updatedImports } = getTokenMatch(
      colors,
      'colors',
      'border-color',
      BORDER_COLOR,
      remSize
    );
    css += updatedCss;
    updatedImports.forEach(i => imports.push(i));
  }

  const BORDER_RADIUS = (() => {
    if (element.cornerRadius) {
      return `${element.cornerRadius}px`;
    }
  })();

  if (BORDER_RADIUS) {
    const { updatedCss, updatedImports } = getTokenMatch(
      radii,
      'radii',
      'border-radius',
      BORDER_RADIUS,
      remSize
    );
    css += updatedCss;
    updatedImports.forEach(i => imports.push(i));
  }

  const SHADOW = (() => {
    if (element.effects) {
      if (element.effects[0]) {
        if (element.effects[0].type === 'DROP_SHADOW') {
          const dropShadow = element.effects[0];

          const X = dropShadow.offset.x;
          const Y = dropShadow.offset.y;
          const RADIUS = dropShadow.radius;
          const R = roundColorValue(dropShadow.color.r);
          const G = roundColorValue(dropShadow.color.g);
          const B = roundColorValue(dropShadow.color.b);
          const A = roundColorValue(dropShadow.color.a, 1);

          return `${X}px ${Y}px ${RADIUS}px rgba(${R}, ${G}, ${B}, ${A})`;
        }
      }
    }
  })();

  if (SHADOW) {
    const { updatedCss, updatedImports } = getTokenMatch(
      shadows,
      'shadows',
      'box-shadow',
      SHADOW,
      remSize
    );
    css += updatedCss;
    updatedImports.forEach(i => imports.push(i));
  }

  return { css, imports };
}
