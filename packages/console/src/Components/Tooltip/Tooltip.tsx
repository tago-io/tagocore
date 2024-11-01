import {
  Children,
  type ReactNode,
  cloneElement,
  useEffect,
  useRef,
} from "react";
import type { EIcon } from "../../index.ts";
import TooltipPopup from "./TooltipPopup.tsx";

/**
 * Props.
 */
interface ITooltipProps {
  text?: ReactNode;
  color?: string;
  children: ReactNode;
  /**
   * Icon of the tooltip.
   */
  icon?: EIcon | null;
}

/**
 */
function Tooltip(props: ITooltipProps) {
  const tooltipPopup = useRef<TooltipPopup>(null);
  const childrenRefs = useRef<HTMLElement[]>([]);
  const { text, children } = props;

  /**
   */
  const open = (e: any) => {
    const el = e.target.getBoundingClientRect();
    tooltipPopup.current?.open(el.x, el.y, el.width, el.height);
    e?.stopPropagation();
  };

  /**
   */
  const close = (e?: any) => {
    tooltipPopup.current?.close();
    e?.stopPropagation();
  };

  /**
   */
  useEffect(() => {
    const items = childrenRefs.current;
    for (const item of items) {
      item?.addEventListener("mouseenter", open);
      item?.addEventListener("mouseleave", close);
    }

    return () => {
      for (const item of items) {
        item?.removeEventListener("mouseenter", open);
        item?.removeEventListener("mouseleave", close);
      }
    };
  });

  /**
   */
  useEffect(() => {
    window.addEventListener("mousewheel", close);
    window.addEventListener("resize", close);
    window.addEventListener("touchend", close); // handles movement on mobile to close the popup
    window.addEventListener("touchmove", close); // handles movement on mobile to close the popup

    return () => {
      window.removeEventListener("mousewheel", close);
      window.removeEventListener("resize", close);
      window.removeEventListener("touchmove", close);
      window.removeEventListener("touchend", close);
    };
  });

  if (!text) {
    // no text for the tooltip, just render the children
    return <>{children}</>;
  }

  return (
    <>
      {Children.map(children, (child, index) =>
        cloneElement(child as any, {
          ref: (e: HTMLElement) => (childrenRefs.current[index] = e),
        }),
      )}

      <TooltipPopup
        align={(props as any).align || "center"}
        color={(props as any).color}
        header={(props as any).header}
        icon={(props as any).icon}
        position={(props as any).position}
        ref={tooltipPopup}
        text={props.text}
      />
    </>
  );
}

export default Tooltip;
