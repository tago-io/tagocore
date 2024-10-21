import { useState, useCallback, useEffect, type ReactNode, useRef } from "react";
import type { ITag, ISummary } from "@tago-io/tcore-sdk/types";
import { EIcon } from "../Icon/Icon.types";
import InnerNav from "../InnerNav/InnerNav.tsx";
import PaginatedTable from "../PaginatedTable/PaginatedTable.tsx";
import type { IColumn } from "../PaginatedTable/PaginatedTable.types";
import setDocumentTitle from "../../Helpers/setDocumentTitle.ts";
import useApiRequest from "../../Helpers/useApiRequest.ts";
import * as Style from "./ListPage.style";

/**
 * Props.
 */
interface IListPageProps<T> {
  /**
   * Custom component to be inserted at the right side of the navigation bar.
   */
  children?: ReactNode;
  /**
   * Color of the rows and the inner navigation bar.
   */
  color: string;
  /**
   * Description of the inner navigation bar.
   */
  description: ReactNode;
  /**
   * Icon of the inner navigation bar.
   */
  icon: EIcon;
  /**
   * URL to redirect the user when they click on a row.
   */
  path: string;
  /**
   * Title of the document/page.
   */
  documentTitle?: string;
  /**
   * Title of the inner navigation bar.
   */
  innerNavTitle: string;
  /**
   * Columns of the table.
   */
  columns: IColumn<T>[];
  /**
   * Summary key to get the amount of records.
   */
  summaryKey: keyof ISummary;
  /**
   * Called to fetch the data for the page.
   */
  onGetData: (page: number, idealAmountOfRows: number, filter: any) => Promise<T[]> | T[];
}

/**
 * List page for a certain type of resource.
 */
function ListPage<T extends { id?: string }>(props: IListPageProps<T>) {
  const [page, setPage] = useState(1);
  const [infinitePages, setInfinitePages] = useState(false);
  const [amountOfRecords, setAmountOfRecords] = useState(0);
  const tagValues = useRef<ITag[]>([]);
  const { onGetData, summaryKey, documentTitle, path, color, columns } = props;
  const { data: summary } = useApiRequest<ISummary>("/summary");
  const { data: tags } = useApiRequest<string[]>(`/tags/keys/${summaryKey}`);

  /**
   * Returns the link for a record.
   */
  const getRowLink = useCallback(
    (item: T) => {
      return `/console/${path}/${item.id}`;
    },
    [path]
  );

  /**
   * Fetches the data and returns it.
   */
  const getData = useCallback(
    async (pg: number, idealAmountOfRows: number, filter: any) => {
      const filterWithTags = { ...filter };
      if (tagValues.current.length > 0) {
        filterWithTags.tags = tagValues.current;
      }

      const usingFilter = Object.keys(filterWithTags).some(
        (x) => filterWithTags[x] !== undefined && filterWithTags[x] !== ""
      );
      const data = await onGetData(pg, idealAmountOfRows, filterWithTags);

      setAmountOfRecords(data.length);
      setInfinitePages(usingFilter);

      return data;
    },
    [onGetData]
  );

  /**
   * Renders the tag value.
   */
  const renderTag = (item: any, rowIndex: number, column: IColumn<T>) => {
    const tag = item?.tags?.find((x: ITag) => x?.key === column?.id);
    return tag?.value || "";
  };

  /**
   * Renders the tag value.
   */
  const onTagFilterChange = (value: string, column: IColumn<T>) => {
    const item = tagValues.current.find((x) => x.key === column?.id);
    if (item && value) {
      item.value = `*${value}*`;
    } else if (!item && value) {
      tagValues.current.push({ key: column.id, value: `*${value}*` });
    } else if (item && !value) {
      tagValues.current = tagValues.current.filter((x) => x !== item);
    }
  };

  /**
   * Combines the tags of the resource and the default columns.
   */
  const getColumns = () => {
    const cols: IColumn<T>[] = [...columns];
    for (const tag of tags || []) {
      cols.push({
        icon: EIcon.tag,
        id: tag,
        label: tag,
        onFilter: onTagFilterChange,
        onRender: renderTag,
      });
    }
    return cols;
  };

  /**
   * Sets the document title.
   */
  useEffect(() => {
    if (documentTitle) {
      setDocumentTitle(documentTitle);
    }
  }, [documentTitle]);

  return (
    <Style.Container>
      <InnerNav
        color={props.color}
        description={props.description}
        icon={props.icon}
        title={props.innerNavTitle}
      >
        {props.children}
      </InnerNav>

      <PaginatedTable<T>
        amountOfRecords={infinitePages ? amountOfRecords : summary?.[summaryKey] || 0}
        columns={getColumns()}
        emptyMessage={"Nothing here yet."}
        emptyMessageIcon={props.icon}
        highlightColor={color}
        onChangePage={setPage}
        onGetData={getData}
        onGetRowLink={getRowLink}
        infinitePages={infinitePages}
        page={page}
      />
    </Style.Container>
  );
}

export default ListPage;
