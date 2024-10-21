import * as Style from "./ErrorMessage.style";

/**
 */
function ErrorMessage(props: any) {
  const { children, style } = props;
  return <Style.Container style={style}>{children}</Style.Container>;
}

export default ErrorMessage;
