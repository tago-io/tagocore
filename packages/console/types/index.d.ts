/**
 * PNG Imports will return a string containing the path to the image.
 */
declare module "*.png" {
  const content: string;
  export default content;
}

/**
 * GIF Imports will return a string containing the path to the image.
 */
declare module "*.gif" {
  const content: string;
  export default content;
}

/**
 * SVG Imports will return the actual <svg> tag in a react component.
 */
declare module "*.svg" {
  const content: ReactSVGElement;
  export default content;
}
