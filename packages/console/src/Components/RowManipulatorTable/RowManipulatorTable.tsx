import React, { type UIEvent, useRef } from "react";
import RowManipulator from "../RowManipulator/RowManipulator.tsx";
import TooltipText from "../TooltipText/TooltipText.tsx";
import * as Style from "./RowManipulatorTable.style";
import type { IRowManipulatorTableColumn } from "./RowManipulatorTable.types";

/**
 * Props.
 */
interface IRowManipulatorTableProps<T> {
  /**
   * Columns for the table.
   */
  columns: IRowManipulatorTableColumn<T>[];
  /**
   * The highlight color for when the user hovers an item.
   */
  highlightColor?: string;
  /**
   * Data to be rendered in this component.
   */
  data: T[];
  /**
   * Called when the user presses the add button.
   */
  onAddItem?: () => void;
  /**
   * Called when the user presses the remove button to remove a specific row.
   */
  onRemoveItem?: (index: number) => void;
  /**
   */
  disabled?: boolean;
}

/**
 */
function RowManipulatorTable<T>(props: IRowManipulatorTableProps<T>) {
  const { columns, disabled, onAddItem, onRemoveItem } = props;
  const data = props.data || [];
  const refHeader = useRef<HTMLDivElement>(null);

  /**
   * Renders a single header cell.
   */
  const renderHeaderCell = (column: IRowManipulatorTableColumn<T>) => {
    const flex = column.flex || "1";
    const width = column.width || "auto";
    return (
      <div key={column.label} className="cell" style={{ width, flex }}>
        <TooltipText tooltip={column.tooltip}>{column.label}</TooltipText>
      </div>
    );
  };

  /**
   * Renders a single body/row cell.
   */
  const renderRowCell = (
    item: T,
    column: IRowManipulatorTableColumn<T>,
    rowIndex: number,
  ) => {
    const flex = column.flex || "1";
    const width = column.width || "auto";
    return (
      <div key={column.label} className="cell" style={{ width, flex }}>
        {column.onRender(item, rowIndex)}
      </div>
    );
  };

  /**
   * Renders a single row.
   */
  const renderRow = (item: T, rowIndex: number) => {
    return (
      <React.Fragment key={rowIndex}>
        {props.columns.map((column) => renderRowCell(item, column, rowIndex))}
      </React.Fragment>
    );
  };

  /**
   * Called when the body gets scrolled.
   * We use this to scroll the header accordingly by the same amount in order for it to stay
   * horizontally aligned with the cells of the row.
   */
  const onBodyScroll = (e: UIEvent<HTMLDivElement>) => {
    if (refHeader.current) {
      const visibleTableStyle = refHeader.current.style;
      visibleTableStyle.transform = `translateX(-${(e.target as HTMLDivElement).scrollLeft}px)`;
    }
  };

  return (
    <Style.Container>
      <Style.Header>
        <div ref={refHeader} className="slide-header">
          {columns.map(renderHeaderCell)}
          <div className="offset" />
        </div>
      </Style.Header>

      <Style.Body onScroll={onBodyScroll}>
        <RowManipulator
          onAddItem={onAddItem}
          onRemoveItem={onRemoveItem}
          data={data}
          onRenderItem={renderRow}
          disabled={disabled}
        />
      </Style.Body>
    </Style.Container>
  );
}

export default RowManipulatorTable;
