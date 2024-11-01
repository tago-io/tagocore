import type React from "react";
import {
  type ReactNode,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { unstable_batchedUpdates } from "react-dom";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import Icon from "../Icon/Icon.tsx";
import { EIcon } from "../Icon/Icon.types";
import Input from "../Input/Input.tsx";
import Loading from "../Loading/Loading.tsx";
import * as Style from "./OptionsPicker.style";

/**
 * Props.
 */
interface IOptionsPicker<T> {
  /**
   * Value currently selected.
   */
  value?: T | string | null;
  labelField?: keyof T;
  placeholder?: string;
  doesRequest?: boolean;
  onGetOptions: (query: string, page: number) => Promise<T[]> | T[];
  onRenderOption: (option: T) => ReactNode;
  onResolveOption?: (
    optionID: string | number,
  ) => Promise<T | null | undefined>;
  onChange: (option: T) => void;
  /**
   * Indicates if this component has invalid data.
   * If this is set to `true`, this component will get a red border.
   */
  error?: boolean;
  /**
   * Sets the message that will appear below the input if this component has an error.
   */
  errorMessage?: string;
  /**
   * Position of the options container. Default is `bottom`.
   */
  optionsPosition?: "top" | "bottom";
}

/**
 */
function OptionsPicker<T = any>(props: IOptionsPicker<T>) {
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingByString, setLoadingByString] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const filterTimeout = useRef<any>(null);
  const reachedScrollEnd = useRef(false);

  const {
    error,
    errorMessage,
    labelField,
    onChange,
    onGetOptions,
    onRenderOption,
    onResolveOption,
    optionsPosition,
    placeholder,
    value,
  } = props;

  /**
   * Called when the input gains focus.
   */
  const onInputFocus = () => {
    setFocused(true);
    setLoading(true);
  };

  /**
   * Called when the input loses focus.
   */
  const onInputBlur = () => {
    setOptions([]);
    setPage(1);
    setFocused(false);
  };

  /**
   * Loads the options that will be rendered inside of the options container.
   */
  const loadOptions = useCallback(async () => {
    if (!focused) {
      return;
    }

    let opts: T[] = [];
    try {
      clearTimeout(filterTimeout.current);
      if (page === 1) {
        setLoading(true);
      }

      opts = await onGetOptions(query.toLowerCase(), page);
    } finally {
      unstable_batchedUpdates(() => {
        setLoading(false);
        setOptions((o) => (page === 1 ? opts : [...o, ...opts]));
      });
    }
  }, [onGetOptions, focused, page, query]);

  /**
   * Renders a single option from the dropdown list.
   */
  const renderOption = (option: T) => {
    return (
      <div
        key={(option as any).id}
        className="option"
        onClick={() => selectOption(option)}
      >
        {onRenderOption(option)}
      </div>
    );
  };

  /**
   * Called when the options container receives a `mouse down` event.
   */
  const onOptionsMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  /**
   * Called when the options container gets scrolled.
   */
  const onOptionsScroll = (e: React.UIEvent) => {
    const container = e.target as HTMLDivElement;
    const height = container.scrollHeight - container.offsetHeight - 50;

    if (container.scrollTop >= height) {
      // Reached scroll end, check the lock:
      if (!reachedScrollEnd.current) {
        reachedScrollEnd.current = true; // Activate the lock
        setPage(page + 1);
      }
    } else if (container.scrollHeight === container.offsetHeight) {
      e.preventDefault();
    } else {
      // Not reached scroll end, release lock:
      reachedScrollEnd.current = false;
    }
  };

  /**
   * Renders the loading ball.
   */
  const renderLoading = () => {
    return (
      <div className="loading-container">
        <Loading />
      </div>
    );
  };

  /**
   */
  const applyFilterTimeout = (v: string) => {
    clearTimeout(filterTimeout.current);
    setLoading(true);

    filterTimeout.current = setTimeout(() => {
      setQuery(v);
      setPage(1);
    }, 500);
  };

  /**
   * Called when the input value changes manually by the user.
   */
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyFilterTimeout(e.target.value);
    setInputValue(e.target.value);
  };

  /**
   * Called when the user manually selects an option from the option list.
   */
  const selectOption = (option: T) => {
    inputRef?.current?.blur(); // blurs the input to remove focus
    onChange(option); // sets the new option
  };

  /**
   * Clears the selected option.
   * This will set the option to `null`.
   */
  const clear = () => {
    setInputValue("");
    onChange(null as any);
  };

  /**
   * Renders the input icon on the right side of the component.
   */
  const renderInputIcon = () => {
    if (loadingByString) {
      return (
        <Style.IconContainer>
          <Icon rotate size="13px" icon={EIcon.spinner} />
        </Style.IconContainer>
      );
    }
    if (value) {
      return (
        <Style.IconContainer $clickable onClick={clear}>
          <Icon size="13px" icon={EIcon.times} />
        </Style.IconContainer>
      );
    }
    return (
      <Style.IconContainer>
        <Icon size="15px" icon={EIcon["caret-down"]} />
      </Style.IconContainer>
    );
  };

  /**
   */
  useEffect(() => {
    Promise.resolve().then(async () => {
      if (typeof value === "string" || typeof value === "number") {
        setLoadingByString(true);
        const option = await onResolveOption?.(value).catch(() => null);
        onChange(option as T);
        setLoadingByString(false);
      }
    });
  }, [onChange, onResolveOption, value]);

  /**
   */
  useEffect(() => {
    if (!focused) {
      setQuery("");

      if (value && typeof value === "object") {
        // sets the value of the input as the label of the value
        setInputValue(String(value[labelField as keyof T] || ""));
      } else {
        // clears the input
        setInputValue("");
      }
    }
  }, [labelField, focused, value]);

  /**
   */
  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  return (
    <>
      <Style.Container>
        <Input
          error={error}
          onBlur={onInputBlur}
          onChange={onChangeInput}
          onFocus={onInputFocus}
          placeholder={loadingByString ? "Loading..." : placeholder}
          ref={inputRef}
          value={inputValue}
          disabled={loadingByString}
        />

        {focused && (
          <Style.Options
            onScroll={onOptionsScroll}
            onMouseDown={onOptionsMouseDown}
            position={optionsPosition || "bottom"}
            data-testid="options"
          >
            {loading ? renderLoading() : options.map(renderOption)}
          </Style.Options>
        )}

        {renderInputIcon()}
      </Style.Container>

      {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </>
  );
}

export default memo(OptionsPicker) as typeof OptionsPicker;
