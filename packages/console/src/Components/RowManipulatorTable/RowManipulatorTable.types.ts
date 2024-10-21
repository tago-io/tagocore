import type { ReactNode } from "react";

/**
 * A single column in a row manipulator table.
 */
export interface IRowManipulatorTableColumn<T> {
  /**
   * Label of the column. This is what will appear above the filter in the header.
   */
  label: string;
  /**
   * The amount of flex of this column.
   */
  flex?: string;
  /**
   * If flex = `none` then this will specify the desired width for the column.
   */
  width?: string;
  /**
   * Optional tooltip for explanation.
   */
  tooltip?: string;
  /**
   * Called for every cell in the body. This should return the content of the cell.
   */
  onRender: (item: T, rowIndex: number) => ReactNode;
}
