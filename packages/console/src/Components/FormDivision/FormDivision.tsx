import type { ReactNode } from "react";
import Icon from "../Icon/Icon.tsx";
import type { EIcon } from "../Icon/Icon.types";
import * as Style from "./FormDivision.style";

/**
 * Props.
 */
interface IFormDivision {
  /**
   * The icon for this component.
   */
  icon?: EIcon;
  /**
   * Indicates if a border should be rendered above the component.
   * This also enables padding above the item to create some distance between the border and the title.
   */
  renderBorder?: boolean;
  /**
   * Description below the title.
   */
  description?: ReactNode;
  /**
   * The main title of this component.
   */
  title?: ReactNode;
}

/**
 * This component acts like a division between sections of the page.
 * It shows a title, description and an icon to provide explanation for a new section in a form.
 */
function FormDivision(props: IFormDivision) {
  const { renderBorder, icon, title, description } = props;

  return (
    <Style.Container $renderBorder={renderBorder}>
      {(icon || title) && (
        <div className="title">
          {icon && <Icon size="12px" icon={icon} />}
          {title && <h2>{title}</h2>}
        </div>
      )}

      {description && <div className="description">{description}</div>}
    </Style.Container>
  );
}

export default FormDivision;
