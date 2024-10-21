import { useCallback, useEffect, useState } from "react";
import { useTheme } from "styled-components";
import { fonts } from "../../../../theme.ts";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import * as Style from "./Publisher.style";

/**
 * Props.
 */
interface IPublisherProps {
  /**
   * Domain of the publisher (will only be true when `verified` = true).
   */
  domain?: string | null;
  /**
   * Name of the publisher.
   */
  name: string;
  /**
   * Optional size of this component. Defaults to `default`.
   */
  size?: "default" | "medium";
  /**
   * If the name can be clicked to show the verified domain.
   */
  clickable?: boolean;
}

/**
 * Renders the publisher name and a verified badge.
 */
function Publisher(props: IPublisherProps) {
  const [tooltip, setTooltip] = useState(false);
  const { name, clickable, domain, size } = props;
  const theme = useTheme();

  /**
   * Gets the size for the font part.
   */
  const getFontSize = useCallback(() => {
    if (size === "medium") {
      return fonts.medium;
    }
      return fonts.default;
  }, [size]);

  /**
   * Gets the size for the SVG icon.
   */
  const getIconSize = useCallback(() => {
    if (size === "medium") {
      return "12px";
    }
      return "10px";
  }, [size]);

  /**
   * Activates the tooltip.
   */
  const activateTooltip = useCallback(() => {
    if (clickable) {
      setTooltip(true);
    }
  }, [clickable]);

  /**
   * Effect used to close the tooltip when the clicks outside of it.
   */
  useEffect(() => {
    function closeTooltip() {
      setTooltip(false);
    }

    window.addEventListener("mousedown", closeTooltip);
    return () => window.removeEventListener("mousedown", closeTooltip);
  });

  return (
    <Style.Container onMouseDown={(e) => e.stopPropagation()} onClick={activateTooltip}>
      <Style.Name clickable={!!(clickable && domain)} style={{ fontSize: getFontSize() }}>
        {name || "Unknown"}
      </Style.Name>

      {name && domain ? (
        <>
          <Style.IconContainer clickable={clickable} size={size as string}>
            <Icon color={theme.link} icon={EIcon.certificate} size={getIconSize()} />
            <Icon color="white" icon={EIcon.check} size={getIconSize()} />
          </Style.IconContainer>

          {tooltip && (
            <Style.Tooltip>
              <div>We&apos;ve verified that the publisher {name} controls the domain:</div>
              <div className="domain">
                <Icon icon={EIcon.certificate} size={"11px"} />
                <span>{domain}</span>
              </div>
            </Style.Tooltip>
          )}
        </>
      ) : null}
    </Style.Container>
  );
}

export default Publisher;
