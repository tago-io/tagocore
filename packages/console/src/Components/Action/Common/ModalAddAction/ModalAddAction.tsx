import {
  type IAction,
  type IActionCreate,
  type IPluginConfigField,
  type IPluginModuleList,
  zName,
} from "@tago-io/tcore-sdk/types";
import { type MouseEvent, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useTheme } from "styled-components";
import { useApiRequest } from "../../../../index.ts";
import validateConfigFields from "../../../../Helpers/validateConfigFields.ts";
import createAction from "../../../../Requests/createAction/createAction.ts";
import buildZodError from "../../../../Validation/buildZodError.ts";
import FormGroup from "../../../FormGroup/FormGroup.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input.tsx";
import Modal from "../../../Modal/Modal.tsx";
import {
  zFrontAction,
  zFrontActionTagoIO,
  zFrontActionPost,
  zFrontActionScript,
} from "../../Action.interface";
import ActionFields from "../ActionFields/ActionFields.tsx";
import TriggerRadio from "../TriggerRadio/TriggerRadio.tsx";

interface IModalAddAction {
  onClose: () => void;
}

/**
 * The modal to create a new action.
 */
function ModalAddAction(props: IModalAddAction) {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [type, setType] = useState("condition");
  const [newID, setNewID] = useState("");
  const [action, setAction] = useState<any>({});
  const [errors, setErrors] = useState<any>();
  const history = useHistory();
  const { onClose } = props;
  const { data: typeModules } = useApiRequest<IPluginModuleList>("/module?type=action-type");

  const validateType = useCallback(async () => {
    try {
      if (!action?.type) {
        await zFrontAction.parseAsync(action);
      } else if (action?.type === "script") {
        await zFrontActionScript.parseAsync(action);
      } else if (action?.type === "post") {
        await zFrontActionPost.parseAsync(action);
      } else if (action?.type === "tagoio") {
        await zFrontActionTagoIO.parseAsync(action);
      } else {
        const item = typeModules.find(
          (x) => `${x.pluginID}:${x.setup.id}` === (action.type?.id || action?.type)
        );
        if (item) {
          const err = validateConfigFields(
            item.setup?.option?.configs as IPluginConfigField[],
            action
          );
          if (err) {
            return err;
          }
        }
      }
    } catch (ex: any) {
      const err = buildZodError(ex.issues);
      return err;
    }
  }, [action, typeModules]);

  /**
   * Validates the data of the action.
   */
  const validate = useCallback(async () => {
    const typeError = await validateType();
    const err = {
      ...typeError,
      type: !action?.type,
      name: !zName.safeParse(name).success,
    };

    setErrors(err);

    if (typeError || err.name || err.type) {
      return false;
    }

    return true;
  }, [validateType, action, name]);

  /**
   * Creates the action.
   */
  const doRequest = useCallback(async () => {
    const data: Partial<IAction> = {
      name: name,
      type,
      active: true,
      tags: [],
    };

    if (action?.type === "script") {
      data.action = zFrontActionScript.parse(action);
      data.action.script = data.action.script.map((x: any) => x.id || x);
    } else if (action?.type === "tagoio") {
      data.action = zFrontActionTagoIO.parse(action);
    } else if (action?.type === "post") {
      data.action = zFrontActionPost.parse(action);
    } else {
      data.action = action;
      data.action.type = data.action?.type?.id || data.action?.type;
    }

    const response = await createAction(data as IActionCreate);

    setNewID(response);
  }, [action, type, name]);

  /**
   * Called when the confirm button is pressed.
   */
  const confirm = useCallback(
    async (e?: MouseEvent) => {
      if (await validate()) {
        await doRequest();
      }
      e?.preventDefault();
    },
    [doRequest, validate]
  );

  /**
   * Used to transfer the user to the newly created action.
   */
  useEffect(() => {
    if (newID) {
      history.push(`/console/actions/${newID}`);
    }
  }, [history, newID]);

  return (
    <Modal
      color={theme.action}
      icon={EIcon.bolt}
      onClose={onClose}
      onConfirm={confirm}
      title="Add Action"
      width="650px"
    >
      <FormGroup label="Name" icon={EIcon.bolt}>
        <Input
          autoFocus
          error={errors?.name}
          errorMessage="This field requires at least 3 characters"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name for this action"
          value={name}
        />
      </FormGroup>

      <FormGroup>
        <TriggerRadio value={type} onChange={setType} />
      </FormGroup>

      <FormGroup addMarginBottom={false}>
        <ActionFields
          errors={errors}
          onChangeAction={setAction}
          action={action}
          optionsPosition="top"
          triggerID={type}
        />
      </FormGroup>
    </Modal>
  );
}

export default ModalAddAction;
