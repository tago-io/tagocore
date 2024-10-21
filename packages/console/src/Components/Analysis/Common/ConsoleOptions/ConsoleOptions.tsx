import { memo, useEffect } from "react";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import * as Style from "./ConsoleOptions.style";

/**
 * Props.
 */
interface IConsoleOptionsProps {
  visible: boolean;
  onDelete: () => void;
  onClose: () => void;
}

function ConsoleOptions(props: IConsoleOptionsProps) {
  const { onDelete, onClose, visible } = props;

  useEffect(() => {
    function onMouseDown() {
      onClose();
    }

    window.addEventListener("click", onMouseDown);
    return () => window.removeEventListener("click", onMouseDown);
  }, [onClose]);

  return (
    <Style.Container visible={visible}>
      <div className="item" onClick={onDelete}>
        <Icon size="12px" icon={EIcon["trash-alt"]} />
        <span>Delete logs permanently</span>
      </div>
    </Style.Container>
  );
}

export default memo(ConsoleOptions);
