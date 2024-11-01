import FileSelect from "../FileSelect/FileSelect.tsx";
import FormGroup from "../FormGroup/FormGroup.tsx";
import Icon from "../Icon/Icon.tsx";
import { EIcon } from "../Icon/Icon.types";
import * as Style from "./ProgramFieldset.style";

/**
 * Props.
 */
interface IProgramFieldsetProps {
  /**
   */
  onChangeBinaryPath?: (value: string) => void;
  /**
   */
  onChangeFilePath?: (value: string) => void;
  /**
   */
  binaryPath?: string;
  /**
   */
  filePath?: string;
  /**
   */
  title: string;
}

/**
 * This component displays a path input for a binary executable and another input for the
 * path of the file you want to be run by the binary executable.
 */
function ProgramFieldset(props: IProgramFieldsetProps) {
  const { title, binaryPath, onChangeBinaryPath, onChangeFilePath, filePath } =
    props;

  return (
    <Style.Container>
      <legend>
        <Icon icon={EIcon.code} />
        <span>{title}</span>
      </legend>

      <FormGroup>
        <div className="description">
          Specify the binary executable and file path to be executed when your
          Analysis runs.
        </div>
      </FormGroup>

      <FormGroup label="Binary executable path" icon={EIcon.desktop}>
        <FileSelect
          onChange={(e) => onChangeBinaryPath?.(e)}
          placeholder="Select a binary to be executed"
          value={binaryPath || ""}
          useLocalFs
        />
      </FormGroup>

      <FormGroup label="Analysis File path" icon={EIcon["file-alt"]}>
        <FileSelect
          onChange={(e) => onChangeFilePath?.(e)}
          placeholder="Select the file to be executed by the binary"
          value={filePath || ""}
        />
      </FormGroup>

      {/* <div className="config-button">
        <Button>
          <Icon icon={EIcon.cog} />
        </Button>
      </div> */}
    </Style.Container>
  );
}

export default ProgramFieldset;
