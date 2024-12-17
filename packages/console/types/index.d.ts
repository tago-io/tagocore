/**
 * PNG imports will return a string containing the path to the image.
 */
declare module "*.png" {
  const content: string;
  export default content;
}

/**
 * GIF imports will return a string containing the path to the image.
 */
declare module "*.gif" {
  const content: string;
  export default content;
}

/**
 * SVG imports will return the actual `<svg>` tag in a React component via SVGR.
 */
declare module "*.svg" {
  import type React from "react";
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;

  export default SVG;
}
