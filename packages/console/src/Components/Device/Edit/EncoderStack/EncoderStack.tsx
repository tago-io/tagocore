import type { IPluginClassListItem } from "@tago-io/tcore-sdk/types";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "styled-components";
import Button from "../../../Button/Button.tsx";
import { EButton } from "../../../Button/Button.types";
import EmptyMessage from "../../../EmptyMessage/EmptyMessage.tsx";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import * as Style from "./EncoderStack.style";
import ModalAddEncoder from "./ModalAddEncoder.tsx";

/**
 * Props.
 */
interface IEncoderStackProps {
  /**
   * Stack value.
   */
  value: string[];
  /**
   * Called when the stack value or order changes.
   */
  onChange: (value: string[]) => void;
  /**
   * List of all encoder modules installed.
   */
  encoderModules?: IPluginClassListItem[];
}

/**
 * Renders a stack of encoder modules.
 * Allows you to add unused encoder modules or remove used encoder modules.
 */
function EncoderStack(props: IEncoderStackProps) {
  const { value, encoderModules, onChange } = props;
  const theme = useTheme();

  const [modalAddEncoder, setModalAddEncoder] = useState(false);
  const [selectedID, setSelectedID] = useState<string>("");
  const [targetIndex, setTargetIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   */
  const onItemMouseDown = useCallback((e: React.MouseEvent, item: string) => {
    setSelectedID(item);
    // we do these to prevent selecting the text:
    e.preventDefault();
    e.stopPropagation();
  }, []);

  /**
   * Removes an item from the stack.
   */
  const removeItem = useCallback(
    (item: string) => {
      const index = value.indexOf(item);
      if (index >= 0) {
        value.splice(index, 1);
        onChange(value);
      }
    },
    [value, onChange],
  );

  /**
   * Renders a single encoder class in the stack.
   */
  const renderItem = useCallback(
    (item: string, i: number) => {
      const plugin = encoderModules?.find(
        (x) => `${x.pluginID}:${x.setupID}` === item,
      );
      return (
        <Style.Item index={i} selected={selectedID === item} key={item}>
          <span className="a">
            <span className="b">{i + 1}. </span>
            {plugin ? (
              <div className="c">
                <div>{plugin?.setupName}</div>
                <span className="description">{plugin?.pluginName}</span>
              </div>
            ) : (
              <>
                <Icon
                  icon={EIcon["exclamation-triangle"]}
                  color={theme.buttonDanger}
                />
                <span>&nbsp;&nbsp;Encoder not found</span>
              </>
            )}
          </span>

          <div
            className="icon-container"
            onMouseDown={(e) => onItemMouseDown(e, item)}
          >
            <Icon icon={EIcon["caret-up"]} />
            <div />
            <div />
            <Icon icon={EIcon["caret-down"]} />
          </div>

          <div className="icon-container" onClick={() => removeItem(item)}>
            <Icon icon={EIcon.times} size="15px" />
          </div>
        </Style.Item>
      );
    },
    [theme, encoderModules, removeItem, onItemMouseDown, selectedID],
  );

  /**
   * This effect adds a window listener when the user is trying to drag an item in the stack.
   */
  useEffect(() => {
    if (selectedID) {
      /**
       * Called when the mouse moves with an item selected.
       */
      const onMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) {
          return;
        }

        const { scrollTop } = containerRef.current;
        const containerBounds = containerRef.current.getBoundingClientRect();

        const position = e.clientY - containerBounds.y + scrollTop;
        const floatIndex = Math.floor(position / Style.STACK_ITEM_HEIGHT);
        const clampIndex = Math.min(Math.max(floatIndex, 0), value.length);

        if (targetIndex !== clampIndex) {
          setTargetIndex(clampIndex);
        }
      };

      /**
       * Called when the mouse is released with an item selected.
       */
      const onMouseUp = () => {
        setTargetIndex(-1);
        setSelectedID("");
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [value.length, targetIndex, selectedID]);

  /**
   * This effect is used to change the position of the array when the user
   * is dragging an item to switch positions.
   */
  useEffect(() => {
    if (selectedID && targetIndex >= 0) {
      const fromIndex = value.findIndex((x) => x === selectedID);
      value.splice(fromIndex, 0, value.splice(targetIndex, 1)[0]);
      onChange([...value].filter((x) => x));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedID, targetIndex]);

  /**
   * This array will contain all of the `unselected` encoders,
   * which means the ones that weren't selected yet.
   */
  const unselectedPlugins = encoderModules?.filter((x) => {
    const selected = value.includes(`${x.pluginID}:${x.setupID}`);
    return !selected;
  });

  return (
    <>
      <Style.Container itemAmount={value.length}>
        <div className="title">
          <div className="text">
            <h5>Encoder Stack</h5>
            <span className="description">
              Select the order of encoder plugins for new data.
            </span>
          </div>

          <Button
            onClick={() => setModalAddEncoder(true)}
            disabled={!unselectedPlugins || unselectedPlugins?.length === 0}
            addIconMargin
            type={EButton.primary}
          >
            <Icon icon={EIcon.plus} />
            <span>Add Encoder</span>
          </Button>
        </div>

        <div ref={containerRef} className="stacks">
          {value.length === 0 ? (
            <EmptyMessage
              icon={EIcon["puzzle-piece"]}
              message="No encoders added for this device."
            />
          ) : (
            value.map(renderItem)
          )}
        </div>
      </Style.Container>

      {modalAddEncoder && (
        <ModalAddEncoder
          list={unselectedPlugins || []}
          onClose={() => setModalAddEncoder(false)}
          onConfirm={(selectedIDs: string[]) => {
            const newList = value.concat(selectedIDs);
            onChange(newList);
          }}
        />
      )}
    </>
  );
}

export default memo(EncoderStack);
