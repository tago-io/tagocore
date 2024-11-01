import type { IDevice, IDeviceToken } from "@tago-io/tcore-sdk/types";
import { memo, useCallback, useEffect, useState } from "react";
import copyToClipboard from "../../../../Helpers/copyToClipboard.ts";
import Button from "../../../Button/Button.tsx";
import { EButton } from "../../../Button/Button.types";
import CopyButton from "../../../CopyButton/CopyButton.tsx";
import FormGroup from "../../../FormGroup/FormGroup.tsx";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input.tsx";
import SimpleTable from "../../../SimpleTable/SimpleTable.tsx";
import Tooltip from "../../../Tooltip/Tooltip.tsx";
import * as Style from "./TokenTable.style";

/**
 * Props.
 */
interface ITokenTableProps {
  /**
   * Device's form data.
   */
  data: IDevice;
  /**
   * Tokens of the device.
   */
  tokens: IDeviceToken[];
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
}

/**
 * The token & serial number table of a device.
 */
function TokenTable(props: ITokenTableProps) {
  const [name, setName] = useState("Token #1");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { tokens, onDeleteToken, onGenerateToken, onChangeTokens } = props;

  /**
   * Renders the input in the header.
   */
  const renderTokenLabel = () => {
    return (
      <FormGroup label="Token Name">
        <Input
          disabled={loading}
          error={error}
          onChange={(e) => setName(e.target.value)}
          placeholder="Token #1"
          value={name}
        />
      </FormGroup>
    );
  };

  /**
   * Renders the `Generate` button in the header.
   */
  const renderButtonsLabel = () => {
    return (
      <FormGroup label={<>&nbsp;</>}>
        <Button
          disabled={loading}
          onClick={generateToken}
          type={EButton.primary}
        >
          Generate
        </Button>
      </FormGroup>
    );
  };

  /**
   * Returns the sequential name for the next token.
   */
  const getSequentialName = useCallback(() => {
    return `Token #${tokens.length + 1}`;
  }, [tokens.length]);

  /**
   * Removes an item from this table.
   */
  const removeItem = async (index: number) => {
    const item = tokens[index];
    await onDeleteToken(item.token as string);
    tokens.splice(index, 1);
    props.onChangeTokens([...tokens]);
  };

  /**
   * Called when the `Generate token` button is pressed.
   * This function generates a new token and appends it to the token array.
   */
  const generateToken = async () => {
    if (!name) {
      setError(true);
      return;
    }

    setError(false);
    setLoading(true);

    const token: any = {
      device_id: props.data.id,
      expire_time: "never",
      name,
      permission: "full",
      serie_number: "",
    };

    const response = await onGenerateToken(token);
    token.token = response.token;

    onChangeTokens([...tokens, token]);
    setName(getSequentialName());
    setLoading(false);
  };

  /**
   * Renders the buttons cell of each row.
   */
  const renderButtons = (token: IDeviceToken, index: number) => {
    return (
      <div className="buttons">
        <Tooltip text="Delete token" color="red">
          <Button type={EButton.icon} onClick={() => removeItem(index)}>
            <Icon size="15px" icon={EIcon.minus} />
          </Button>
        </Tooltip>

        <CopyButton onClick={() => copyToClipboard(token.token)} />
      </div>
    );
  };

  /**
   * Used to adjust the header name based on the amount of tokens.
   */
  useEffect(() => {
    setName(getSequentialName());
  }, [getSequentialName]);

  return (
    <Style.Container>
      <SimpleTable<IDeviceToken>
        data={tokens}
        useAlternateRowColor
        emptyMessageIcon={EIcon.cube}
        emptyMessage="No tokens yet."
        columns={[
          {
            key: "label",
            label: renderTokenLabel(),
            onRender: (token) => token.name,
          },
          {
            key: "buttons",
            label: renderButtonsLabel(),
            flex: "none",
            width: 145,
            onRender: renderButtons,
          },
        ]}
      />
    </Style.Container>
  );
}

export default memo(TokenTable);
