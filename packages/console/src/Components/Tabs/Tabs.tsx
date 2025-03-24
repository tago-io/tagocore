import * as Style from "./Tabs.style";
import type { ITab } from "./Tabs.types";

/**
 * Props.
 */
interface ITabsProps {
  /**
   * The actual content information (titles + contents).
   */
  data: ITab[];
  /**
   * Index of the currently selected tab.
   */
  index: number;
  /**
   * The highlight color for the borders of the titles.
   */
  highlightColor?: string;
  /**
   * The background color for the title row.
   */
  titleBackgroundColor?: string;
  /**
   * Called when a tab's title is pressed.
   */
  onChangeIndex: (index: number) => void;
  /**
   * Makes the tab content faded-out, as if it's waiting for something else to load.
   */
  loading?: boolean;
  /**
   */
  showTitles?: boolean;
}

/**
 * Shows multiple tabs. Whenever you click a tab the content changes to the tab's content.
 */
function Tabs(props: ITabsProps) {
  const { data } = props;
  const selectedTab = data[props.index];
  const content = selectedTab?.content || null;

  /**
   * Renders a single tab's title.
   */
  const renderTabTitle = (tab: ITab, index: number) => {
    if (tab.hidden) {
      return null;
    }

    const selected = index === props.index;
    return (
      <Style.TabTitle
        onClick={() => props.onChangeIndex(index)}
        key={index}
        highlightColor={props.highlightColor}
        selected={selected}
      >
        {tab.label}
      </Style.TabTitle>
    );
  };

  return (
    <Style.Container $loading={props.loading}>
      {data.length > 1 && (
        <Style.Titles backgroundColor={props.titleBackgroundColor}>
          {data.map(renderTabTitle)}
        </Style.Titles>
      )}
      <div className="content">{content}</div>
    </Style.Container>
  );
}

export default Tabs;
