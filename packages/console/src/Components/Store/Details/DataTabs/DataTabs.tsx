import { useEffect, useState } from "react";
import Screenshots from "../Screenshots/Screenshots.tsx";
import Loading from "../../../Loading/Loading.tsx";
import Markdown from "../../../Markdown/Markdown.tsx";
import EmptyMessage from "../../../EmptyMessage/EmptyMessage.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Tabs from "../../../Tabs/Tabs.tsx";

/**
 * Props.
 */
interface IDataTabsProps {
  markdownURL: string;
  themeColor?: string;
  screenshots: string[];
  pluginID: string;
  pluginVersion: string;
}

/**
 * Shows some extra information of a plugin divided into tabs.
 */
function DataTabs(props: IDataTabsProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [loadingMarkdown, setLoadingMarkdown] = useState(true);
  const [markdownDescription, setMarkdownDescription] = useState("");

  const { markdownURL, pluginID, themeColor, screenshots } = props;

  /**
   * Renders the markdown description.
   */
  const renderMarkdown = () => {
    if (markdownURL && loadingMarkdown) {
      return <Loading />;
    }

    return markdownDescription ? (
      <Markdown localImgPrefix={`/images2/${pluginID}`} value={markdownDescription} />
    ) : (
      <EmptyMessage icon={EIcon.list} message="No description available." />
    );
  };

  /**
   * Renders screenshots.
   */
  const renderScreenshots = () => {
    return <Screenshots value={screenshots} />;
  };

  /**
   * Fetches the readme data.
   */
  useEffect(() => {
    if (markdownURL) {
      setLoadingMarkdown(false);
      setMarkdownDescription(markdownURL);
    }
  }, [markdownURL]);

  const tabs = [
    {
      label: "Description",
      content: renderMarkdown(),
    },
  ];

  if (screenshots?.length > 0) {
    tabs.push({
      label: "Screenshots",
      content: renderScreenshots(),
    });
  }

  return (
    <Tabs
      data={tabs}
      titleBackgroundColor={themeColor}
      index={tabIndex}
      onChangeIndex={setTabIndex}
    />
  );
}

export default DataTabs;
