import type { ReactNode } from "react";

/**
 * A single column in a simple table.
 */
export interface ISimpleTableColumn<T> {
  /**
   * Optional key for the column. If this is not informed, the label will be used.
   */
  key?: string;
  /**
   * Label of the column..
   */
  label: ReactNode;
  /**
   * The amount of flex of this column.
   */
  flex?: string;
  /**
   * If flex = `none` then this will specify the desired width for the column.
   */
  width?: number;
  /**
   * Called for every cell in the body. This should return the content of the cell.
   */
  onRender: (item: T, rowIndex: number) => ReactNode;
}
