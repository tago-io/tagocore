import { useRef, useEffect, useCallback, useState } from "react";
import EmptyMessage from "../EmptyMessage/EmptyMessage.tsx";
import Icon from "../Icon/Icon.tsx";
import { EIcon } from "../Icon/Icon.types";
import Input from "../Input/Input.tsx";
import Pagination from "../Pagination/Pagination.tsx";
import Select from "../Select/Select.tsx";
import TooltipText from "../TooltipText/TooltipText.tsx";
import type { IColumn, IFilter } from "./PaginatedTable.types";
import * as Style from "./PaginatedTable.style";

/**
 * Props.
 */
interface IPaginatedTableProps<T> {
  /**
   * The configuration for the columns.
   */
  columns: (IColumn<T> | null)[];
  /**
   * The highlight color for when the user hovers an item.
   */
  highlightColor?: string;
  /**
   * Current page.
   */
  page: number;
  /**
   * Total number of records in the list.
   * This is used to calculate the correct amount of pages in the table.
   */
  amountOfRecords: number;
  /**
   * Called to fetch the data for the page.
   */
  onGetData: (page: number, idealAmountOfRows: number, filter: IFilter) => Promise<T[]> | T[];
  /**
   * Called when the page was changed.
   */
  onChangePage: (page: number) => void;
  /**
   * Called for every row about to be rendered.
   * If a string is returned from this function, then that specific row will be a `<a />` tag with a functional link.
   */
  onGetRowLink?: (item: T) => string | null | undefined;
  /**
   * Icon to be rendered in the empty message.
   */
  emptyMessageIcon?: EIcon;
  /**
   * Message to be rendered when there are no records in the table.
   */
  emptyMessage?: string;
  /**
   * Shows page number or not.
   */
  infinitePages?: boolean;
  /**
   */
  showConfigButton?: boolean;
  /**
   */
  onConfigButtonClick?: () => void;
  /**
   */
  refetchID?: number;
  /**
   */
  showRefreshButton?: boolean;
  /**
   */
  onRefreshButtonClick?: () => void;
}

/**
 */
function PaginatedTable<T>(props: IPaginatedTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<IFilter>({});
  const [pageAmount, setPageAmount] = useState(0);
  const {
    amountOfRecords,
    emptyMessage,
    emptyMessageIcon,
    highlightColor,
    infinitePages,
    onChangePage,
    onConfigButtonClick,
    onGetData,
    onGetRowLink,
    onRefreshButtonClick,
    page,
    refetchID,
    showConfigButton,
    showRefreshButton,
  } = props;

  const columns = props.columns.filter((x) => x) as IColumn<T>[];

  const rowsNode = useRef<HTMLDivElement>(null);
  const filterTimeout = useRef<ReturnType<typeof setTimeout>>();
  const firstRender = useRef(true);

  /**
   * Called when one of the filter changes values.
   */
  const onChangeFilter = (column: IColumn<T>, text: any) => {
    setFilter({ ...filter, [column.id]: text });
    column.onFilter?.(text, column);
  };

  /**
   * Renders a header cell.
   */
  const renderHeaderCell = (column: IColumn<T>) => {
    const flex = column.flex || "1";
    const width = column.width || "auto";
    const filterVisible = column.filterVisible !== false;

    return (
      <div key={column.id || column.label} className="cell" style={{ width, flex }}>
        <TooltipText tooltip={column.tooltip}>
          <h2>
            {column.icon && <Icon icon={column.icon} />}
            {column.label}
          </h2>
        </TooltipText>

        {filterVisible && renderFilter(column)}
      </div>
    );
  };

  /**
   * Renders a header cell.
   */
  const renderFilter = (column: IColumn<T>) => {
    const filterDisabled = column.filterDisabled || column.type === "date";
    return (
      <Style.FilterContainer disabled={filterDisabled}>
        {column.type === "boolean" ? (
          <Select
            options={[
              { label: "", value: "" },
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ]}
            onChange={(e) =>
              onChangeFilter(column, e.target.value === "" ? undefined : e.target.value === "true")
            }
            value={String(filter[column.id] ?? "")}
          />
        ) : (
          <Input
            onChange={(e) => onChangeFilter(column, e.target.value)}
            placeholder={filterDisabled ? "" : "search..."}
            value={filter[column.id] || ""}
          />
        )}
      </Style.FilterContainer>
    );
  };

  /**
   * Renders a row cell.
   */
  const renderRowCell = (item: T, column: IColumn<T>, rowIndex: number) => {
    const flex = column.flex || "1";
    const width = column.width || "auto";
    const type = column.type || "text";

    return (
      <div key={column.id + rowIndex} className="cell" style={{ width, flex }}>
        <div className={`inner-cell ${type}`}>{column.onRender(item, rowIndex, column)}</div>
      </div>
    );
  };

  /**
   * Renders a single row.
   */
  const renderRow = (item: T, rowIndex: number) => {
    const link = onGetRowLink?.(item) as string;

    if (link) {
      return (
        <Style.LinkRow key={rowIndex} to={link} $highlightColor={highlightColor}>
          {columns.map((column) => renderRowCell(item, column, rowIndex))}
        </Style.LinkRow>
      );
    }
      return (
        <Style.DivRow key={rowIndex} $highlightColor={highlightColor}>
          {columns.map((column) => renderRowCell(item, column, rowIndex))}
        </Style.DivRow>
      );
  };

  /**
   * Renders the empty message in the center of the table if there are no records in it.
   */
  const renderEmptyMessage = () => {
    if (!emptyMessage) {
      return null;
    }
    return <EmptyMessage icon={emptyMessageIcon as EIcon} message={emptyMessage} />;
  };

  /**
   * Gets the ideal amount of rows to be rendered.
   */
  const getIdealAmountOfRows = () => {
    const node = rowsNode.current as HTMLDivElement;
    if (node) {
      const headerHeight = 60;
      const tableHeight = node.getBoundingClientRect().height - headerHeight;
      const rowHeight = 35;
      const idealAmount = Math.max(Math.floor(tableHeight / rowHeight), 0);
      return idealAmount;
    }
    return 0;
  };

  /**
   */
  const fetchPageData = useCallback(async () => {
    if (!rowsNode.current) {
      return;
    }

    clearTimeout(filterTimeout.current as unknown as number);
    const idealAmount = getIdealAmountOfRows();

    try {
      const result = await onGetData(page, idealAmount, filter);
      setError("");
      setData(result);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.toString?.();
      setError(errorMessage);
    }
  }, [page, filter, onGetData]);

  /**
   */
  useEffect(() => {
    fetchPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  /**
   */
  useEffect(() => {
    if (!firstRender.current) {
      filterTimeout.current = setTimeout(fetchPageData, 300);
      return () => clearTimeout(filterTimeout.current as unknown as number);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  /**
   */
  useEffect(() => {
    if (!firstRender.current && refetchID) {
      fetchPageData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchID]);

  /**
   * Calculates the amount of pages based on the amount of records inside
   * of the table. The amount of pages will be set in a state for future use in
   * the footer component.
   */
  useEffect(() => {
    if (!infinitePages) {
      const idealAmount = getIdealAmountOfRows();
      const total = Math.ceil(amountOfRecords / idealAmount);
      setPageAmount(total);
      fetchPageData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountOfRecords]);

  /**
   * Sets the "first render" variable in order to prevent useless requests.
   */
  useEffect(() => {
    firstRender.current = false;
  }, []);

  let minWidth = 0;
  for (const column of columns) {
    minWidth += column.width || 160;
  }

  return (
    <Style.Container>
      <div className="content" ref={rowsNode}>
        <Style.InnerContent minWidth={minWidth}>
          <Style.Header>{columns.map(renderHeaderCell)}</Style.Header>
          <Style.Body>
            {error ? (
              <EmptyMessage icon={EIcon["exclamation-triangle"]} message={error} />
            ) : amountOfRecords === 0 ? (
              renderEmptyMessage()
            ) : (
              data.map(renderRow)
            )}
          </Style.Body>
        </Style.InnerContent>
      </div>

      <Pagination
        amountOfRecords={amountOfRecords}
        idealAmountOfRows={getIdealAmountOfRows()}
        infinitePages={infinitePages}
        onChange={onChangePage}
        onConfigButtonClick={onConfigButtonClick}
        onRefreshButtonClick={onRefreshButtonClick}
        page={page}
        pageAmount={pageAmount}
        showConfigButton={showConfigButton}
        showRefreshButton={showRefreshButton}
      />
    </Style.Container>
  );
}

export default PaginatedTable;
