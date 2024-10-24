import styled, { css } from "styled-components";
import { fonts } from "../../theme.ts";
import { ESwitchSize } from "./Switch.types";

/**
 * Main style.
 */
export const Container = styled.div<{ $stretch?: boolean }>`
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  .text {
    margin-right: 5px;
  }

  ${(props) =>
    // stretch to fill remaining size
    props.$stretch &&
    css`
      display: flex;
      flex: 1;

      > span {
        flex: 1;
      }
    `}
`;

/**
 * This is rectangle that contains the slider and the text.
 */
export const Rectangle = styled.button<{
  selected?: boolean;
  size?: ESwitchSize;
  $selectedColor?: string;
  $unselectedColor?: string;
}>`
  height: ${(props) => (props.size === ESwitchSize.big ? 33 : 20)}px;
  width: ${(props) => (props.size === ESwitchSize.big ? 105 : 45)}px;
  position: relative;
  border-radius: 3px;
  border: 0;
  padding: 0px;
  transition: 0.2s;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  background: ${(props) =>
    props.selected ? props.$selectedColor : props.$unselectedColor};

  :disabled {
    pointer-events: none;
    opacity: 0.7;
    color: inherit;
  }
`;

/**
 * The little ball that goes from left to right
 */
export const Slider = styled.span<{ selected: boolean }>`
  line-height: 1.5rem;
  text-align: center;
  position: absolute;
  top: 3px;
  left: ${(props) => (props.selected ? "calc(100% - 33% - 3px)" : "3px")};
  right: 0;
  bottom: 0;
  background-color: white;
  transition: 0.4s;
  border-radius: 3px;
  height: calc(100% - 6px);
  width: 33%;
`;

/**
 * The inner text in the middle of the switch.
 */
export const InnerText = styled.span<{ selected?: boolean }>`
  vertical-align: initial;
  white-space: nowrap;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${fonts.default};
  position: relative;
  transition:
    transform 0.15s,
    left 0.25s;
  color: white;
  display: inline-block;

  ${(props) =>
    props.selected
      ? css`
          left: 9px;
          transform: translate(0%, 0);
        `
      : css`
          left: calc(100% - 9px);
          transform: translate(-100%, 0);
        `}
`;
