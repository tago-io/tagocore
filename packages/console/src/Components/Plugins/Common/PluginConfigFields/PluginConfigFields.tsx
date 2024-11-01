import type {
  IPluginConfigField,
  IPluginConfigFieldBoolean,
  IPluginConfigFieldFile,
  IPluginConfigFieldFolder,
  IPluginConfigFieldGroup,
  IPluginConfigFieldNumber,
  IPluginConfigFieldOption,
  IPluginConfigFieldPassword,
  IPluginConfigFieldRadio,
  IPluginConfigFieldRow,
  IPluginConfigFieldString,
  IPluginConfigFieldStringList,
} from "@tago-io/tcore-sdk/types";
import type { ReactNode } from "react";
import isConfigFieldVisible from "../../../../Helpers/isConfigFieldVisible.ts";
import type { EIcon } from "../../../../index.ts";
import FileSelect from "../../../FileSelect/FileSelect.tsx";
import FormGroup from "../../../FormGroup/FormGroup.tsx";
import Icon from "../../../Icon/Icon.tsx";
import IconRadio from "../../../IconRadio/IconRadio.tsx";
import Input from "../../../Input/Input.tsx";
import InputList from "../../../InputList/InputList.tsx";
import OptionList from "../../../OptionList/OptionList.tsx";
import Select from "../../../Select/Select.tsx";
import Switch from "../../../Switch/Switch.tsx";
import TooltipText from "../../../TooltipText/TooltipText.tsx";
import * as Style from "./PluginConfigFields.style";

/**
 * Props
 */
interface IPluginConfigFieldsProps {
  /**
   * The data containing all the fields' information.
   */
  data: IPluginConfigField[];
  /**
   * The value for the fields.
   */
  values: any;
  /**
   * Called when a value of a field changes.
   */
  onChangeValues: (values: any) => void;
  /**
   * Error of the fields.
   */
  errors?: any;
}

/**
 * Shows a series of fields based on a plugin configuration.
 */
function PluginConfigFields(props: IPluginConfigFieldsProps) {
  const { data, values, errors, onChangeValues } = props;

  /**
   * Renders a switch/checkbox field.
   */
  const renderBoolean = (field: IPluginConfigFieldBoolean) => {
    return (
      <FormGroup key={field.field}>
        <Switch
          value={values[field.field] || false}
          onChange={(e) => onChangeValues({ ...values, [field.field]: e })}
        >
          <TooltipText tooltip={field.tooltip}>{field.name}</TooltipText>
        </Switch>
      </FormGroup>
    );
  };

  /**
   * Renders a simple string field.
   */
  const renderString = (field: IPluginConfigFieldString) => {
    return (
      <Input
        error={errors?.[field.field]}
        onChange={(e) =>
          onChangeValues({ ...values, [field.field]: e.target.value })
        }
        placeholder={field.placeholder || ""}
        value={values[field.field] || ""}
      />
    );
  };

  /**
   * Renders a password string field.
   */
  const renderPassword = (field: IPluginConfigFieldPassword) => {
    return (
      <Input
        autoComplete="new-password"
        error={errors?.[field.field]}
        onChange={(e) =>
          onChangeValues({ ...values, [field.field]: e.target.value })
        }
        placeholder={field.placeholder || ""}
        type="password"
        value={values[field.field] || ""}
      />
    );
  };

  /**
   * Renders a simple number field.
   */
  const renderInputNumber = (field: IPluginConfigFieldNumber) => {
    return (
      <Input
        error={errors?.[field.field]}
        onChange={(e) =>
          onChangeValues({ ...values, [field.field]: Number(e.target.value) })
        }
        onWheel={(e) => (e.target as HTMLInputElement).blur()} // annoying scroll
        placeholder={field.placeholder || ""}
        type="number"
        value={values[field.field] || ""}
        min={typeof field.min === "number" ? field.min : undefined}
        max={typeof field.max === "number" ? field.max : undefined}
      />
    );
  };

  /**
   * Renders a select field with a bunch of options.
   */
  const renderOption = (field: IPluginConfigFieldOption) => {
    const options = [
      { value: "", label: "", disabled: true },
      ...(field.options || []),
    ];
    return (
      <Select
        error={errors?.[field.field]}
        onChange={(e) =>
          onChangeValues({ ...values, [field.field]: e.target.value })
        }
        options={options}
        placeholder={field.placeholder || ""}
        value={values[field.field] || ""}
      />
    );
  };

  /**
   * Renders a file selector field.
   */
  const renderFile = (field: IPluginConfigFieldFile) => {
    return (
      <FileSelect
        error={errors?.[field.field]}
        onChange={(e) => onChangeValues({ ...values, [field.field]: e })}
        placeholder={field.placeholder || ""}
        value={values[field.field]}
      />
    );
  };

  /**
   * Renders a folder selector field.
   */
  const renderFolder = (field: IPluginConfigFieldFolder) => {
    return (
      <FileSelect
        error={errors?.[field.field]}
        onChange={(e) => onChangeValues({ ...values, [field.field]: e })}
        onlyFolders
        placeholder={field.placeholder || ""}
        value={values[field.field]}
      />
    );
  };

  /**
   * Renders a string list.
   */
  const renderStringList = (field: IPluginConfigFieldStringList) => {
    return (
      <InputList
        description={field.description}
        errors={errors?.[field.field]}
        icon={field.icon as any}
        key={field.field}
        onChange={(e) => onChangeValues({ ...values, [field.field]: e })}
        placeholder={field.placeholder || ""}
        title={field.title}
        value={Array.isArray(values[field.field]) ? values[field.field] : []}
      />
    );
  };

  /**
   */
  const renderRadio = (field: IPluginConfigFieldRadio) => {
    const option = field.options.find((x) => x.value === values[field.field]);
    const configs = option?.configs || [];

    return (
      <div key={field.field}>
        <IconRadio
          value={values[field.field]}
          onChange={(e) => onChangeValues({ ...values, [field.field]: e })}
          options={field.options.map((x) => ({
            color: values[field.field] === x.value ? x.color || "" : "",
            description: x.description || "",
            icon: x.icon as EIcon,
            label: x.label,
            value: x.value,
          }))}
        />
        {configs.map(renderField)}
      </div>
    );
  };

  /**
   */
  const renderRow = (field: IPluginConfigFieldRow, index: number) => {
    return (
      <Style.Row key={index}>
        {field.configs.map((x, i) => (
          <Style.RowField key={i}>{renderField(x, i)}</Style.RowField>
        ))}
      </Style.Row>
    );
  };

  /**
   */
  const renderGroup = (field: IPluginConfigFieldGroup) => {
    return (
      <FormGroup key={field.field}>
        <fieldset>
          {(field.name || field.icon) && (
            <legend>
              <Icon icon={field.icon as EIcon} />
              <span>{field.name}</span>
            </legend>
          )}
          {field.configs.map(renderField)}
        </fieldset>
      </FormGroup>
    );
  };

  /**
   * Renders a Option list.
   */
  const renderDoubleOptionList = (field: any) => {
    const content = (
      <OptionList
        description={field.description}
        errors={errors?.[field.field]}
        icon={field.icon as any}
        key={field.field}
        onChange={(e) => onChangeValues({ ...values, [field.field]: [...e] })}
        optionsKey={field.key?.options}
        optionsValue={field.value?.options}
        title={field.title}
        value={Array.isArray(values[field.field]) ? values[field.field] : []}
      />
    );

    if (field.name) {
      return (
        <FormGroup
          icon={field.icon as any}
          key={field.field}
          label={field.name}
          tooltip={field.tooltip}
        >
          {content}
        </FormGroup>
      );
    }
    return <FormGroup key={field.field}>{content}</FormGroup>;
  };

  /**
   * Decides which type of fields this component should render.
   */
  const renderField = (field: IPluginConfigField, index: number) => {
    let content: ReactNode = null;

    if (!isConfigFieldVisible(data, field, values)) {
      return null;
    }

    if (field.type === "boolean") {
      return renderBoolean(field);
    }
    if (field.type === "option") {
      content = renderOption(field);
    } else if (field.type === "string") {
      content = renderString(field);
    } else if (field.type === "password") {
      content = renderPassword(field);
    } else if (field.type === "number") {
      content = renderInputNumber(field);
    } else if (field.type === "file") {
      content = renderFile(field);
    } else if (field.type === "folder") {
      content = renderFolder(field);
    } else if (field.type === "string-list") {
      return renderStringList(field);
    } else if (field.type === "select-key-select-value") {
      return renderDoubleOptionList(field);
    } else if (field.type === "radio") {
      return renderRadio(field);
    } else if (field.type === "row") {
      return renderRow(field, index);
    } else if (field.type === "group") {
      return renderGroup(field);
    } else if (field.type === "divisor") {
      return <Style.Divisor key={index} />;
    } else {
      return null;
    }

    return (
      <FormGroup
        icon={field.icon as EIcon}
        key={field.field || index}
        label={field.name}
        tooltip={(field as any).tooltip || ""}
        required={(field as any).required || false}
      >
        {content}
      </FormGroup>
    );
  };

  return <Style.Container>{data?.map(renderField)}</Style.Container>;
}

export default PluginConfigFields;
