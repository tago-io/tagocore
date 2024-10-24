import { type ReactNode, useEffect } from "react";
import Button from "../Button/Button.tsx";
import Icon from "../Icon/Icon.tsx";
import { EIcon } from "../Icon/Icon.types";
import * as Style from "./RowManipulator.style";

/**
 * Props.
 */
interface IRowManipulatorProps<T> {
  /**
   * Data to be rendered in this component.
   */
  data: T[];
  /**
   * Called for each item in the data array.
   */
  onRenderItem: (item: T, index: number) => ReactNode;
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
function RowManipulator<T>(props: IRowManipulatorProps<T>) {
  const { data, disabled, onRenderItem, onAddItem, onRemoveItem } = props;

  /**
   * Renders the buttons at the end of each row.
   */
  const renderButtons = (rowIndex: number) => {
    const last = rowIndex !== data.length - 1;
    return (
      <Style.Buttons $last={last} className="buttons">
        <Button disabled={disabled} onClick={() => onRemoveItem?.(rowIndex)}>
          <Icon size="15px" icon={EIcon.minus} />
        </Button>

        <Button
          disabled={disabled}
          style={{ visibility: last ? "hidden" : "initial" }}
          onClick={onAddItem}
        >
          <Icon size="15px" icon={EIcon.plus} />
        </Button>
      </Style.Buttons>
    );
  };

  /**
   * Renders a single row.
   */
  const renderRow = (item: T, rowIndex: number) => {
    return (
      <div className="row" key={rowIndex}>
        <div className="content">{onRenderItem(item, rowIndex)}</div>
        {renderButtons(rowIndex)}
      </div>
    );
  };

  /**
   */
  useEffect(() => {
    if (!data || data.length === 0) {
      onAddItem?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return <Style.Container>{data.map(renderRow)}</Style.Container>;
}

export default RowManipulator;
