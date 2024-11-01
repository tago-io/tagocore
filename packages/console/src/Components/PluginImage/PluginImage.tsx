import { useCallback, useState } from "react";
import { EIcon, Icon } from "../../index.ts";
import * as Style from "./PluginImage.style";

/**
 * Props.
 */
interface IPluginImageProps {
  /**
   * Width in pixels for the image. The height will be adjusted based on this.
   */
  width: number;
  /**
   * Source of the image.
   */
  src?: string | null;
}

/**
 * Shows the logo of a plugin in the usual dimensions.
 */
function PluginImage(props: IPluginImageProps) {
  const [fail, setFail] = useState(false);
  const { src, width } = props;
  const height = width / 1.35;

  /**
   * Called when the image couldn't load.
   */
  const onImgError = useCallback(() => {
    setFail(true);
  }, []);

  return (
    <Style.Container width={width} height={height}>
      {fail ? (
        <Icon icon={EIcon.times} size="16px" />
      ) : src ? (
        <img onError={onImgError} alt="" width={`${width}px`} src={src} />
      ) : null}
    </Style.Container>
  );
}

export default PluginImage;
