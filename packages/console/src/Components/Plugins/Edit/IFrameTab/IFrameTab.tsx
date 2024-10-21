import * as Style from "./IFrameTab.style";

/**
 */
interface IIFrameTabProps {
  url: string;
}

/**
 */
function IFrameTab(props: IIFrameTabProps) {
  return <Style.Container src={props.url} />;
}

export default IFrameTab;
