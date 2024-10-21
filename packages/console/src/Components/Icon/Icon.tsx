import { Suspense, memo } from "react";
import { type EIcon, icons } from "./Icon.types";
import * as Style from "./Icon.style";

/**
 * Props.
 */
interface IIcon {
  /**
   * Size of the icon.
   */
  size?: string;
  /**
   * The icon identifier.
   */
  icon?: EIcon;
  /**
   * Optional color of the icon.
   */
  color?: string;
  /**
   * If the icon should be rotating or not.
   */
  rotate?: boolean;
}

/**
 * Renders a dynamic SVG icon.
 */
function Icon(props: IIcon) {
  if (!props.icon) {
    return null;
  }

  const { rotate } = props;
  const Component = icons[props.icon];
  const size = props.size || "12px";

  return (
    <Suspense fallback={<Style.IconFallback size={size} />}>
      <Style.Container isRotating={rotate} size={size} color={props.color}>
        <Component width={size} height={size} />
      </Style.Container>
    </Suspense>
  );
}

export default memo(Icon);
