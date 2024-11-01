import { EIcon } from "../../../../../index.ts";
import EmptyMessage from "../../../../EmptyMessage/EmptyMessage.tsx";
import * as Style from "./MessageTriggerNotFound.style";

interface IMessageTriggerNotFound {
  triggerName: string;
  isPlugin?: boolean;
}

/**
 * This is a message component showing the text "trigger not found".
 * Used to show the user that the trigger can't be used/found.
 */
function MessageTriggerNotFound(props: IMessageTriggerNotFound) {
  const { triggerName } = props;
  return (
    <Style.Container>
      <EmptyMessage
        icon={EIcon.times}
        message={
          <>
            <span>
              Trigger <b>{triggerName}</b> was not found.
            </span>
            <br />
            <span>
              This action cannot be edited and it will never be triggered.
            </span>
          </>
        }
      />
    </Style.Container>
  );
}

export default MessageTriggerNotFound;
