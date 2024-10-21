import { useEffect, useRef, useState } from "react";
import Button, { type IButtonProps } from "../Button/Button.tsx";
import { EButton } from "../Button/Button.types";
import Icon from "../Icon/Icon.tsx";
import { EIcon } from "../Icon/Icon.types";
import Tooltip from "../Tooltip/Tooltip.tsx";

/**
 * Props.
 */
interface ICopyButtonProps extends IButtonProps {
  /**
   * Called when the button is clicked.
   */
  onClick: () => void;
  /**
   * Size for the icon, default is `15px`.
   */
  iconSize?: string;
  /**
   * Tooltip text for the button, default is `Copy`.
   */
  tooltip?: string;
}

/**
 * A button to copy info, only shows an icon inside.
 */
function CopyButton(props: ICopyButtonProps) {
  const [clicked, setClicked] = useState(false);
  const timeout = useRef<any>(null);
  const { onClick, tooltip, iconSize } = props;

  /**
   * Called when the button is clicked.
   */
  const click = () => {
    setClicked(true);
    onClick();
  };

  /**
   * Used to show a different icon for 1s then fade back to the original icon.
   */
  useEffect(() => {
    if (clicked) {
      timeout.current = setTimeout(() => {
        setClicked(false);
      }, 1000);
    }
    return () => clearTimeout(timeout.current);
  }, [clicked]);

  return (
    <Tooltip text={tooltip || "Copy"}>
      <Button {...props} type={EButton.icon} onClick={click}>
        <Icon size={iconSize || "15px"} icon={clicked ? EIcon.check : EIcon.copy} />
      </Button>
    </Tooltip>
  );
}

export default CopyButton;
