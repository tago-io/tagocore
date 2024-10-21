import { EIcon, Icon } from "../../../../../index.ts";
import EmptyMessage from "../../../../EmptyMessage/EmptyMessage.tsx";
import * as Style from "./MessageCronTooComplex.style";

/**
 * This is a message component showing the text "this schedule is too complex".
 * Used to show the user that the cron is too difficult to be put in fields.
 */
function MessageCronTooComplex() {
  return (
    <Style.Container>
      <EmptyMessage
        icon={EIcon.clock}
        message={
          <>
            <span>This schedule is too complex.</span>
            <br />
            <span>Please use the advanced option.</span>
          </>
        }
      />
      <Style.ArrowContainer>
        <Icon size="45px" icon={EIcon["arrow-up"]} color="rgba(0, 0, 0, .25)" />
      </Style.ArrowContainer>
    </Style.Container>
  );
}

export default MessageCronTooComplex;
