import type { ReactNode } from "react";
import type { EIcon } from "../Icon/Icon.types";

/**
 * A single option in the icon radio.
 */
export interface IIconRadioOption {
  /**
   * Inner value for the option.
   */
  value: string;
  /**
   * Label of the option.
   */
  label: ReactNode;
  /**
   * Icon for the option.
   */
  icon: EIcon;
  /**
   * Description that will appear below the title.
   */
  description?: string;
  /**
   * Color for the icon when selected.
   */
  color?: string;
  /**
   * If the option is disabled or not.
   */
  disabled?: boolean;
}
