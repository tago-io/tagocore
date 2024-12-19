import { useEffect, useState } from "react";
import FlexRow from "../../../FlexRow/FlexRow.tsx";
import FormGroup from "../../../FormGroup/FormGroup.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input.tsx";
import PluginConfigFields from "../../../Plugins/Common/PluginConfigFields/PluginConfigFields.tsx";
import Switch from "../../../Switch/Switch.tsx";
import ActionTypePicker from "../ActionTypePicker/ActionTypePicker.tsx";
import HttpHeaders from "../HttpHeaders/HttpHeaders.tsx";
import MultipleAnalysis from "../MultipleAnalysis/MultipleAnalysis.tsx";

interface IActionFields {
  /**
   * Error of the fields.
   */
  errors?: any;
  /**
   * Where to render the position of the picker.
   */
  optionsPosition?: "bottom" | "top";
  /**
   * .action object of the action.
   */
  action: any;
  /**
   * function to change the action object.
   */
  onChangeAction: (action: any) => void;
  /**
   * ID of the selected trigger.
   */
  triggerID?: string;
}

function ActionFields(props: IActionFields) {
  const { errors, optionsPosition, action, onChangeAction } = props;
  const [actionType, setActionType] = useState<any>(action?.type);

  /**
   * Renders the TagoIO configuration.
   */
  const renderTagoIO = () => {
    return (
      <>
        <FormGroup
          tooltip="Insert the token of a Device located in your TagoIO Cloud account"
          icon={EIcon.device}
          label="Device Token"
        >
          <Input
            autoComplete="new-password"
            onChange={(e) =>
              onChangeAction({ ...action, token: e.target.value })
            }
            placeholder="enter a device's token"
            type="password"
            value={action?.token || ""}
            error={errors?.token}
          />
        </FormGroup>
      </>
    );
  };

  /**
   * Renders the post configuration.
   */
  const renderPost = () => {
    return (
      <>
        <FormGroup label="HTTP Post End-point">
          <Input
            onChange={(e) => onChangeAction({ ...action, url: e.target.value })}
            placeholder="enter the url address"
            value={action?.url || ""}
            error={errors?.url}
          />
        </FormGroup>

        <FormGroup label="HTTP Headers">
          <HttpHeaders
            value={action.headers || {}}
            onChange={(headers) => onChangeAction({ ...action, headers })}
          />
        </FormGroup>

        <FormGroup
          label="Fallback Device Token"
          icon={EIcon.device}
          tooltip="Enable and configure the token for a device to receive the data in case TagoIO API's requests fail a certain amount of times."
        >
          <FlexRow>
            <div style={{ marginRight: "10px", flex: 1 }}>
              <Input
                value={action.fallback_token ?? ""}
                onChange={(e) =>
                  onChangeAction({ ...action, fallback_token: e.target.value })
                }
                disabled={!action.http_post_fallback_enabled}
                placeholder="Fallback device token"
                error={errors?.fallback_token}
              />
            </div>

            <div style={{ flex: "none" }}>
              <Switch
                value={action.http_post_fallback_enabled || false}
                onChange={(e) =>
                  onChangeAction({
                    ...action,
                    fallback_token: e ? action.fallback_token || "" : null,
                    http_post_fallback_enabled: e,
                  })
                }
              >
                Enabled
              </Switch>
            </div>
          </FlexRow>
        </FormGroup>
      </>
    );
  };

  /**
   * Renders the analysis option.
   */
  const renderAnalysis = () => {
    const data: any = action.script || [{}];
    return (
      <MultipleAnalysis
        data={data}
        onChange={(e) => onChangeAction({ ...action, script: e })}
        optionsPosition={optionsPosition}
        errors={errors?.script ? data.map((x: any) => !x?.id) : []}
      />
    );
  };

  /**
   * Renders the plugin configuration.
   */
  const renderCustomOption = () => {
    return (
      <PluginConfigFields
        data={actionType.configs || []}
        values={action}
        onChangeValues={(values) =>
          onChangeAction({ ...values, type: actionType })
        }
        errors={errors}
      />
    );
  };

  /**
   * Renders the action fields.
   */
  const renderContent = () => {
    if (actionType?.id === "script") {
      return renderAnalysis();
    }
    if (actionType?.id === "post") {
      return renderPost();
    }
    if (actionType?.id === "tagoio") {
      return renderTagoIO();
    }
    if (actionType?.id) {
      return renderCustomOption();
    }
    return null;
  };

  /**
   * Sets the type into the action.
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies(action): useEffect state machine
  useEffect(() => {
    onChangeAction({ ...action, type: actionType?.id || actionType });
  }, [actionType, onChangeAction]);

  return (
    <>
      <FormGroup
        icon={EIcon.bolt}
        tooltip="This is what will happen once your action is triggered."
        label="Type"
      >
        <ActionTypePicker
          onChange={setActionType}
          optionsPosition={optionsPosition}
          value={actionType}
          error={errors?.type}
          triggerID={props.triggerID}
        />
      </FormGroup>

      <div style={{ padding: "0px 35px" }}>{renderContent()}</div>
    </>
  );
}

export default ActionFields;
