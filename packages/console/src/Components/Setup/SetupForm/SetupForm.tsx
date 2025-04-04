import { observer } from "mobx-react";
import type { ReactNode } from "react";
import { Button, type EButton, Footer, Loading } from "../../../index.ts";
import * as Style from "./SetupForm.style";

interface ISetupFormProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  buttons?: SetupFormButton[];
  loading?: boolean;
  onRenderAfterFooter?: () => ReactNode;
}

export interface SetupFormButton {
  label?: string;
  disabled?: boolean;
  type?: EButton;
  onClick?: (...params: any) => void;
}

function SetupForm(props: ISetupFormProps) {
  const {
    onRenderAfterFooter,
    loading,
    description,
    buttons,
    title,
    children,
  } = props;

  const renderButton = (button: SetupFormButton, index: number) => {
    return (
      <Button
        disabled={button.disabled}
        key={index}
        onClick={button.onClick}
        type={button.type}
      >
        {button.label}
      </Button>
    );
  };

  return (
    <Style.Container>
      <div className="inner-form">
        {title && (
          <Style.Title>
            <h1>{title}</h1>
            {description && <span>{description}</span>}
          </Style.Title>
        )}

        <Style.Content isLoading={loading || false}>{children}</Style.Content>

        {loading && <Loading />}

        <Footer>{buttons?.map(renderButton)}</Footer>

        {onRenderAfterFooter?.()}
      </div>
    </Style.Container>
  );
}

export default observer(SetupForm);
