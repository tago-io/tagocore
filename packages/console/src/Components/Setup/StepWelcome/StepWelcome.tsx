import { getSystemName } from "@tago-io/tcore-shared";
import Logo from "../../../../assets/images/logo-black.svg";
import { EButton } from "../../../index.ts";
import SetupForm from "../SetupForm/SetupForm.tsx";
import * as Style from "./StepWelcome.style";

function StepWelcome(props: { onNext: () => void }) {
  return (
    <SetupForm
      buttons={[
        {},
        { label: "Next", onClick: props.onNext, type: EButton.primary },
      ]}
    >
      <Style.Content>
        <h2>Welcome to</h2>
        <Logo />
        <div className="texts">
          <div>This setup will help you configure your {getSystemName()}.</div>
          <div>
            Press <span className="next">Next</span> to continue when you are
            ready.
          </div>
        </div>
      </Style.Content>
    </SetupForm>
  );
}

export default StepWelcome;
