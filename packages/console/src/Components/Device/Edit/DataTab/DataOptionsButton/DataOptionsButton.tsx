import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import Button from "../../../../Button/Button.tsx";
import Icon from "../../../../Icon/Icon.tsx";
import { EIcon } from "../../../../Icon/Icon.types";
import * as Style from "./DataOptionsButton.style";

interface DataOptionsButtonProps {
  disabled?: boolean;
}

export function DataOptionsButton(props: DataOptionsButtonProps) {
  const { disabled } = props;

  const [dropdown, setDropdown] = useState(false);
  const [modalUninstall, setModalUninstall] = useState(false);
  const loc = useLocation();

  const onClickOptions = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setDropdown(true);
    },
    [],
  );

  const enable = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setDropdown(false);
    e.preventDefault();
  }, []);

  const disable = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setDropdown(false);
    e.preventDefault();
  }, []);

  useEffect(() => {
    function closeDropdown() {
      setDropdown(false);
    }

    window.addEventListener("mousedown", closeDropdown);
    return () => window.removeEventListener("mousedown", closeDropdown);
  });

  return (
    <>
      <Button disabled={disabled} addIconMargin onClick={onClickOptions}>
        <Icon icon={EIcon["ellipsis-v"]} />
        <span>More</span>
      </Button>

      <Style.Dropdown
        visible={dropdown}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="item" onClick={enable}>
          <span>Restore from file</span>
        </div>
        <div className="item" onClick={disable}>
          <span>Backup to file</span>
        </div>
        <div className="item" onClick={disable}>
          <span>Empty Device data</span>
        </div>
      </Style.Dropdown>
    </>
  );
}
