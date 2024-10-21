import type { IDevice } from "@tago-io/tcore-sdk/types";
import { useCallback } from "react";
import FileSelect from "../../../FileSelect/FileSelect.tsx";
import FormGroup from "../../../FormGroup/FormGroup.tsx";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import * as Style from "./PayloadParser.style";

/**
 * Props.
 */
interface IPayloadParserProps {
  /**
   * Device's form data.
   */
  data: IDevice;
  /**
   * Called when a field is changed.
   */
  onChange: (field: keyof IDevice, value: IDevice[keyof IDevice]) => void;
}

/**
 * Payload parser field, located in the device edit screen.
 */
function PayloadParser(props: IPayloadParserProps) {
  const { data, onChange } = props;

  /**
   * Closes the file selector modal.
   */
  const setPayloadParser = useCallback(
    (filePath: string) => {
      onChange("payload_parser", filePath);
    },
    [onChange]
  );

  return (
    <Style.Container>
      <legend>
        <Icon icon={EIcon.code} />
        <span>Payload parser</span>
      </legend>

      <Style.Description>
        Payload Parser is a code which will run when your device makes a POST request. You can post
        process your data by adding a javascript file.
      </Style.Description>

      <FormGroup>
        <FileSelect
          onChange={(e) => setPayloadParser(e)}
          placeholder="Select a .js file to parse incoming data"
          value={data.payload_parser || ""}
          accept=".js"
        />
      </FormGroup>
    </Style.Container>
  );
}

export default PayloadParser;
