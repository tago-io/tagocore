import { type ReactNode, useEffect, useRef, useState } from "react";
import { type EIcon, Icon } from "../../../../index.ts";
import * as Style from "./Status.style";

/**
 * Props.
 */
interface IStatusProps {
  value: string;
  icon?: EIcon;
  color?: string;
  iconColor?: string;
  title?: string;
  iconSize?: string;
  children?: ReactNode;
}

/**
 */
function Status(props: IStatusProps) {
  const { value, title, children, iconSize, icon, iconColor, color } = props;

  const [runningAnimation, setRunningAnimation] = useState(false);
  const [animation, setAnimation] = useState<string>("");
  const [text, setText] = useState(value || 0);

  const timeout = useRef<any>(null);
  const runAgain = useRef(false);

  useEffect(() => {
    if (value !== text) {
      if (runningAnimation) {
        runAgain.current = true;
      }
      setRunningAnimation(true);
    }
    // eslint-disable-next-line
  }, [value]);

  useEffect(() => {
    if (runningAnimation) {
      setAnimation("animated-to");

      timeout.current = setTimeout(() => {
        setText(props.value);
        setAnimation("animated-from");
        setRunningAnimation(false);
      }, 350);

      return () => clearTimeout(timeout.current);
    }if (runAgain.current) {
      runAgain.current = false;
      setRunningAnimation(true);
    }
    // eslint-disable-next-line
  }, [runningAnimation]);

  return (
    <Style.Container iconColor={iconColor} backgroundColor={color}>
      <div className="stretch">
        {icon && <Icon icon={icon} size={iconSize} color={iconColor} />}
        <div>
          {title && <h2>{title}</h2>}
          <span className={`value ${animation}`}>{text || "&nbsp;"}</span>
        </div>
      </div>

      <div>{children}</div>
    </Style.Container>
  );
}

export default Status;
