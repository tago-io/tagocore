import { useCallback, useState } from "react";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import * as Style from "./Screenshots.style";

/**
 * Props.
 */
interface IScreenshotsProps {
  value: string[];
}

/**
 */
function Screenshots(props: IScreenshotsProps) {
  const [index, setIndex] = useState(0);
  const { value } = props;

  /**
   * Increases the index (goes to another screenshot).
   */
  const increaseIndex = useCallback(() => {
    if (index >= value.length - 1) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  }, [index, value.length]);

  /**
   * Decreases the index (goes to another screenshot).
   */
  const decreaseIndex = useCallback(() => {
    if (index <= 0) {
      setIndex(value.length - 1);
    } else {
      setIndex(index - 1);
    }
  }, [index, value.length]);

  return (
    <Style.Container>
      <div className="top-part">
        <Style.Arrow onClick={decreaseIndex}>
          <Icon icon={EIcon["chevron-left"]} size="20px" />
        </Style.Arrow>

        <div className="screenshot-container">
          <img alt={`screenshot-${index}`} src={value[index]} />
        </div>

        <Style.Arrow onClick={increaseIndex}>
          <Icon icon={EIcon["chevron-right"]} size="20px" />
        </Style.Arrow>
      </div>

      <div className="dots-container">
        {value.map((_, i) => (
          <Style.Dot key={i} selected={i === index} />
        ))}
      </div>
    </Style.Container>
  );
}

export default Screenshots;
