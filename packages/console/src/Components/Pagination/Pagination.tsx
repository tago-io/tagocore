import { useRef } from "react";
import { Tooltip } from "../../index.ts";
import Icon from "../Icon/Icon.tsx";
import { EIcon } from "../Icon/Icon.types";
import { getPageList } from "./Pagination.logic";
import * as Style from "./Pagination.style";

/**
 * Props.
 */
interface IPaginationProps {
  /**
   * Current page.
   */
  page: number;
  /**
   * Amount of pages to be rendered.
   */
  pageAmount: number;
  /**
   * Called when the page was changed.
   */
  onChange: (page: number) => void;
  /**
   * Shows page number or not.
   */
  infinitePages?: boolean;
  /**
   * Total number of records in the list.
   * This is used only if the `infinitePages` prop is active.
   */
  amountOfRecords?: number;
  /**
   * Ideal amount of rows in the list.
   * This is used only if the `infinitePages` prop is active.
   */
  idealAmountOfRows?: number;
  /**
   */
  showConfigButton?: boolean;
  /**
   */
  onConfigButtonClick?: () => void;
  /**
   */
  showRefreshButton?: boolean;
  /**
   */
  onRefreshButtonClick?: () => void;
}

/**
 */
function Pagination(props: IPaginationProps) {
  const { page, pageAmount, amountOfRecords, idealAmountOfRows, infinitePages, onChange } = props;
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Goes back one page.
   */
  const goBack = () => {
    onChange(page - 1);
  };

  /**
   * Advances one page.
   */
  const goForward = () => {
    onChange(page + 1);
  };

  /**
   * Renders a single item.
   */
  const renderItem = (value: number | string, index: number) => {
    const selected = page === value;
    if (typeof value === "string") {
      return <Style.PaginationSeparator key={`separator-${index}`}>...</Style.PaginationSeparator>;
    }
      return (
        <Style.Button key={value} onClick={() => onChange(value)} selected={selected}>
          {value}
        </Style.Button>
      );
  };

  /**
   */
  const renderArrow = (icon: EIcon, disabled: boolean, onClick: VoidFunction) => {
    return (
      <Style.Button disabled={disabled} onClick={onClick}>
        <Icon icon={icon} />
      </Style.Button>
    );
  };

  /**
   * Renders the 'finite' pages in this component. Finite pages are the ones
   * that have a start and end, different from the infinite pages which
   * just show two arrows.
   */
  const renderFinitePages = () => {
    if (!containerRef?.current?.clientWidth) {
      return null;
    }

    const array = getPageList(pageAmount, containerRef?.current?.clientWidth, page);
    const nextDisabled = !pageAmount || page === pageAmount;
    return (
      <>
        {renderArrow(EIcon["chevron-left"], page === 1, goBack)}
        {array.map(renderItem)}
        {renderArrow(EIcon["chevron-right"], nextDisabled, goForward)}
      </>
    );
  };

  return (
    <Style.Container ref={containerRef}>
      {props.showConfigButton && (
        <Tooltip text="Configure table">
          <div className="config-button" onClick={props.onConfigButtonClick}>
            <Icon icon={EIcon.cog} size="13px" />
          </div>
        </Tooltip>
      )}

      {infinitePages ? (
        <>
          {renderArrow(EIcon["chevron-left"], page === 1, goBack)}
          {renderArrow(
            EIcon["chevron-right"],
            (amountOfRecords || 0) < (idealAmountOfRows || 0),
            goForward
          )}
        </>
      ) : pageAmount > 0 ? (
        renderFinitePages()
      ) : null}

      {props.showRefreshButton && (
        <Tooltip text="Refresh variables">
          <div className="refresh-button" onClick={props.onRefreshButtonClick}>
            <Icon icon={EIcon.redo} size="13px" />
          </div>
        </Tooltip>
      )}
    </Style.Container>
  );
}

export default Pagination;
