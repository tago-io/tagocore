import type { ReactNode } from "react";

export interface ITab {
  label: ReactNode;
  content: ReactNode;
  /** Controls visibility of a tab. */
  hidden?: boolean;
}
