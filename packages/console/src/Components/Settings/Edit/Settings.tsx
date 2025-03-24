import {
  type ISettings,
  type ISettingsMetadata,
  zSettings,
} from "@tago-io/tcore-sdk/types";
import cloneDeep from "lodash.clonedeep";
import { useCallback, useRef, useState } from "react";
import { useTheme } from "styled-components";
import editSettings from "../../../Requests/editSettings.ts";
import buildZodError from "../../../Validation/buildZodError.ts";
import EditPage from "../../EditPage/EditPage.tsx";
import { EIcon } from "../../Icon/Icon.types";
import ModalChanges from "../Common/ModalChanges/ModalChanges.tsx";
import GeneralInformationTab from "./GeneralInformationTab/GeneralInformationTab.tsx";

/**
 * The device edit page.
 */
function Settings() {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [modalChanges, setModalChanges] = useState(false);
  const [data, setData] = useState<ISettings>({} as ISettings);
  const loaded = useRef(false);
  const metadata = useRef<ISettingsMetadata>();

  const loading = !loaded.current;
  const initialData = useRef<ISettings>({} as ISettings);

  /**
   * Called when the record was fetched by the edit page.
   * We use this to set the data state to manipulate the object.
   */
  const onFetch = useCallback((result: any) => {
    setData(result.settings);
    metadata.current = result.metadata;
    initialData.current = cloneDeep(result.settings);
    loaded.current = true;
  }, []);

  const validate = useCallback(async () => {
    try {
      await zSettings.parseAsync({ ...data, port: Number(data.port) });
      setModalChanges(true);
      setErrors({});
    } catch (ex: any) {
      const err = buildZodError(ex.issues);
      setErrors(err);
    }
    return false;
  }, [data]);

  const save = useCallback(async () => {
    await editSettings(data);
    initialData.current = cloneDeep(data);
    setData({ ...data });
  }, [data]);

  const saveAndDontReload = useCallback(() => {
    setModalChanges(false);
    return save();
  }, [save]);

  const saveAndReload = useCallback(async () => {
    setModalChanges(false);
    await save();
  }, [save]);

  const deactivateModalChanges = useCallback(() => {
    setModalChanges(false);
  }, []);

  const onChangeData = useCallback(
    (field: keyof ISettings, value: any) => {
      setData({ ...data, [field]: value });
    },
    [data],
  );

  const renderGeneralInformationTab = () => {
    return (
      <GeneralInformationTab
        metadata={metadata.current}
        errors={errors}
        data={data}
        onChange={onChangeData}
      />
    );
  };

  const checkIfDataChanged = useCallback(() => {
    return JSON.stringify(initialData.current) !== JSON.stringify(data);
  }, [data]);

  return (
    <>
      <EditPage<ISettings>
        color={theme.settings}
        documentTitle="Settings"
        icon={EIcon.cog}
        innerNavTitle="Settings"
        loading={loading}
        onChangeTabIndex={setTabIndex}
        onCheckIfDataChanged={checkIfDataChanged}
        onFetch={onFetch}
        onSave={save}
        onValidate={validate}
        requestPath="settings"
        tabIndex={tabIndex}
        tabs={[
          {
            label: "General Information",
            content: renderGeneralInformationTab(),
          },
        ]}
      />

      {modalChanges && (
        <ModalChanges
          onClose={deactivateModalChanges}
          onCancel={saveAndDontReload}
          onConfirm={saveAndReload}
        />
      )}
    </>
  );
}

export default Settings;
