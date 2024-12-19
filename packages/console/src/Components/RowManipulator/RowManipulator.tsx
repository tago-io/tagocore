import { type ReactNode, useEffect } from "react";
import Button from "../Button/Button.tsx";
import Icon from "../Icon/Icon.tsx";
import { EIcon } from "../Icon/Icon.types";
import * as Style from "./RowManipulator.style";

interface IRowManipulatorProps<T> {
  /**
   * Data to be rendered in this component.
   */
  data: T[];
  disabled?: boolean;
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
}

function RowManipulator<T>(props: IRowManipulatorProps<T>) {
  const { data, disabled, onRenderItem, onAddItem, onRemoveItem } = props;

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

  const renderRow = (item: T, rowIndex: number) => {
    return (
      <div className="row" key={rowIndex}>
        <div className="content">{onRenderItem(item, rowIndex)}</div>
        {renderButtons(rowIndex)}
      </div>
    );
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies(onAddItem): useEffect side effect
  useEffect(() => {
    if (!data || data.length === 0) {
      onAddItem?.();
    }
  }, [data]);

  return <Style.Container>{data.map(renderRow)}</Style.Container>;
}

export default RowManipulator;
