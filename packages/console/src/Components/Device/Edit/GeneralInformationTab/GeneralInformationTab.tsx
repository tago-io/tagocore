import type { IDevice, IDeviceToken } from "@tago-io/tcore-sdk/types";
import { useCallback } from "react";
import Col from "../../../Col/Col.tsx";
import FormDivision from "../../../FormDivision/FormDivision.tsx";
import FormGroup from "../../../FormGroup/FormGroup.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input.tsx";
import ResourceLinkField from "../../../ResourceLinkField/ResourceLinkField.tsx";
import Row from "../../../Row/Row.tsx";
import PayloadParser from "../../Common/PayloadParser/PayloadParser.tsx";
import TokenTable from "../../Common/TokenTable/TokenTable.tsx";
import EncoderStack from "../EncoderStack/EncoderStack.tsx";

/**
 * Props.
 */
interface IGeneralInformationTabProps {
  /**
   * Device's form data.
   */
  data: IDevice;
  /**
   * Device's form errors.
   */
  errors: any;
  /**
   * Tokens of the device.
   */
  tokens?: IDeviceToken[];
  /**
   * Called when a field is changed.
   */
  onChange: (field: keyof IDevice, value: IDevice[keyof IDevice]) => void;
  /**
   * Called when the tokens change.
   */
  onChangeTokens: (tokens: IDeviceToken[]) => void;
  /**
   * Called when a new token needs to be generated.
   */
  onGenerateToken: (data: IDeviceToken) => Promise<IDeviceToken>;
  /**
   * Called when a token needs to be deleted.
   */
  onDeleteToken: (token: string) => Promise<void>;
  encoderModules: any;
}

/**
 * The device's `General Information` tab.
 */
function GeneralInformationTab(props: IGeneralInformationTabProps) {
  const { data, errors, encoderModules, onChange } = props;

  /**
   * Can be called to change the value of the encoder stack.
   */
  const onChangeEncoderStack = useCallback(
    (value: string[]) => {
      onChange("encoder_stack", value);
    },
    [onChange],
  );

  return (
    <div>
      <FormDivision icon={EIcon.cog} title="General Information" />

      <Row>
        <Col size="7">
          <Row>
            <Col size="12">
              <FormGroup icon={EIcon.device} label="Name">
                <Input
                  defaultValue={data.name || ""}
                  error={errors.name}
                  errorMessage="This field requires at least 3 characters"
                  onChange={(e) => onChange("name", e.target.value)}
                  placeholder="Enter the device's name"
                />
              </FormGroup>
            </Col>

            <Col size="12">
              <FormGroup
                tooltip="Depending on the connector used, devices may require serial numbers or other types of fields"
                label="Token & Serial Number"
                icon={EIcon.list}
              >
                <TokenTable
                  data={data}
                  onChangeTokens={props.onChangeTokens}
                  onGenerateToken={props.onGenerateToken}
                  onDeleteToken={props.onDeleteToken}
                  tokens={props.tokens || []}
                />
              </FormGroup>
            </Col>
          </Row>
        </Col>

        <Col size="5">
          <FormGroup>
            <PayloadParser data={data} onChange={onChange} />
          </FormGroup>

          <EncoderStack
            encoderModules={encoderModules || []}
            onChange={onChangeEncoderStack}
            value={data.encoder_stack || []}
          />
        </Col>
      </Row>
    </div>
  );
}

export default GeneralInformationTab;
