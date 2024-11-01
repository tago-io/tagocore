import { type UIEvent, useRef } from "react";
import EmptyMessage from "../EmptyMessage/EmptyMessage.tsx";
import type { EIcon } from "../Icon/Icon.types";
import * as Style from "./SimpleTable.style";
import type { ISimpleTableColumn } from "./SimpleTable.types";

/**
 * Props.
 */
interface ISimpleTableProps<T> {
  /**
   * Columns for the table.
   */
  columns: ISimpleTableColumn<T>[];
  /**
   * The highlight color for when the user hovers an item.
   */
  highlightColor?: string;
  /**
   * Data to be rendered in this component.
   */
  data: T[];
  /**
   * If enabled, every odd row will have a background color to differentiate it from the odd rows.
   */
  useAlternateRowColor?: boolean;
  /**
   * Called for every row about to be rendered.
   * If a string is returned from this function, then that specific row will be a `<a />` tag with a functional link.
   */
  onGetRowLink?: (item: T) => string | null | undefined;
  /**
   * Icon to be rendered in the empty message.
   */
  emptyMessageIcon?: EIcon;
  /**
   * Message to be rendered when there are no records in the table.
   */
  emptyMessage?: string;
}

/**
 */
function SimpleTable<T>(props: ISimpleTableProps<T>) {
  const {
    columns,
    useAlternateRowColor,
    highlightColor,
    onGetRowLink,
    emptyMessageIcon,
    emptyMessage,
  } = props;
  const data = props.data || [];
  const refHeader = useRef<HTMLDivElement>(null);

  /**
   * Renders a single header cell.
   */
  const renderHeaderCell = (column: ISimpleTableColumn<T>) => {
    const flex = column.flex || "1";
    const width = column.width || "auto";
    const key = column.key || String(column.label);
    return (
      <div key={key} className="cell" style={{ width, flex }}>
        {column.label}
      </div>
    );
  };

  /**
   * Renders a single body/row cell.
   */
  const renderRowCell = (
    item: T,
    column: ISimpleTableColumn<T>,
    rowIndex: number,
  ) => {
    const flex = column.flex || "1";
    const width = column.width || "auto";
    const key = column.key || String(column.label);
    return (
      <div key={`${key}${rowIndex}`} className="cell" style={{ width, flex }}>
        {column.onRender(item, rowIndex)}
      </div>
    );
  };

  /**
   * Renders a single row.
   */
  const renderRow = (item: T, rowIndex: number) => {
    const link = onGetRowLink?.(item) as string;

    if (link) {
      return (
        <Style.LinkRow
          key={rowIndex}
          to={link}
          $highlightColor={highlightColor}
          $useAlternateRowColor={useAlternateRowColor}
        >
          {props.columns.map((column) => renderRowCell(item, column, rowIndex))}
        </Style.LinkRow>
      );
    }
    return (
      <Style.DivRow
        key={rowIndex}
        $useAlternateRowColor={useAlternateRowColor}
        $highlightColor={highlightColor}
      >
        {props.columns.map((column) => renderRowCell(item, column, rowIndex))}
      </Style.DivRow>
    );
  };

  /**
   * Renders the empty message in the center of the table if there are no records in it.
   */
  const renderEmptyMessage = () => {
    if (!emptyMessage) {
      return null;
    }
    return (
      <EmptyMessage icon={emptyMessageIcon as EIcon} message={emptyMessage} />
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
        </div>
      </Style.Header>

      <Style.Body onScroll={onBodyScroll}>
        {data?.length === 0 ? renderEmptyMessage() : data.map(renderRow)}
      </Style.Body>
    </Style.Container>
  );
}

export default SimpleTable;
