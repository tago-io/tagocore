import { type ImgHTMLAttributes, Suspense, lazy, memo } from "react";
import * as Style from "./Markdown.style";

/**
 * Props.
 */
interface IMarkdownProps {
  /**
   * Markdown content.
   */
  value: string;
  /**
   * Path to prepend to local img paths.
   */
  localImgPrefix?: string;
}

/**
 * Renders a markdown content.
 */
function Markdown(props: IMarkdownProps) {
  const { value, localImgPrefix } = props;
  const ReactMarkdown = lazy(() => import("react-markdown"));

  /**
   */
  const prependIfLocal = (src?: string) => {
    if (src?.startsWith("http")) {
      return src;
    }
    if (src?.startsWith("/")) {
      src = src.substring(1);
    }
    src = `${localImgPrefix}/${src}`;
    return src;
  };

  /**
   */
  const renderImg = (imgProps: ImgHTMLAttributes<HTMLImageElement>) => {
    const src = localImgPrefix ? prependIfLocal(imgProps?.src) : imgProps?.src;
    return <Style.Img {...imgProps} src={src} ref={null} />;
  };

  return (
    <Style.Container>
      <Suspense fallback={<div />}>
        <ReactMarkdown components={{ img: renderImg }}>{value}</ReactMarkdown>
      </Suspense>
    </Style.Container>
  );
}

export default memo(Markdown);
