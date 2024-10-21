import { getSystemName } from "@tago-io/tcore-shared";
import { EButton } from "../../../index.ts";
import Logo from "../../../../assets/images/logo-black.svg";
import SetupForm from "../SetupForm/SetupForm.tsx";
import * as Style from "./StepWelcome.style";

/**
 */
function StepWelcome(props: any) {
  const { onNext } = props;

  return (
    <SetupForm
      buttons={[{}, { label: "Next", onClick: onNext, type: EButton.primary }]}
    >
      <Style.Content>
        <h2>Welcome to</h2>
        <Logo />
        <div className="texts">
          <div>This setup will help you configure your {getSystemName()}.</div>
          <div>Press next to continue when you are ready.</div>
        </div>
      </Style.Content>
    </SetupForm>
  );
}

export default StepWelcome;
