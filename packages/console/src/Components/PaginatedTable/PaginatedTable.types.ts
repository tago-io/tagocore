import type { ReactNode } from "react";
import type { EIcon } from "../Icon/Icon.types";

/**
 * A single column in a paginated table.
 */
export interface IColumn<T> {
  /**
   * Label of the column. This is what will appear above the filter in the header.
   */
  label: string;
  /**
   * Optional icon on the left side of the label.
   */
  icon?: EIcon;
  /**
   * The amount of flex of this column.
   */
  flex?: string;
  /**
   * If flex = `none` then this will specify the desired width for the column.
   */
  width?: number;
  /**
   * Tooltip for the label.
   */
  tooltip?: string;
  filter?: string;
  /**
   * Unique ID for this column. This is used to associate the filter object to this ID when fetching data.
   */
  id: string;
  /**
   * Type of data in this column, this is used to adjust the filter accordingly.
   */
  type?: "text" | "boolean" | "date" | "number" | "icon";
  /**
   * Called for every cell in the body. This should return the content of the cell.
   */
  onRender: (item: T, rowIndex: number, column: IColumn<T>) => ReactNode;
  /**
   * Called when the filter changes.
   */
  onFilter?: (value: string, column: IColumn<T>) => void;
  /**
   * Indicates if the filter can be visible or not.
   */
  filterVisible?: boolean;
  /**
   * Indicates if the filter is disabled or not.
   */
  filterDisabled?: boolean;
}

/**
 * Filter object used in the state.
 */
export interface IFilter {
  [key: string]: string;
}
