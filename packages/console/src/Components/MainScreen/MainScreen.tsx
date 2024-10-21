import { type ReactNode, useCallback, useState } from "react";
import Navbar from "../Navbar/Navbar.tsx";
import Sidebar from "../Sidebar/Sidebar.tsx";
import * as Style from "./MainScreen.style";

/**
 * Props.
 */
interface IMainScreenProps {
  children?: ReactNode;
}

/**
 * Main screen for the whole application.
 * This component shows a sidebar and the navbar, as well as an empty space in
 * the middle that will render the children of this component.
 */
function MainScreen(props: IMainScreenProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /**
   * Toggles the sidebar visibility.
   */
  const onSidebarToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen]);

  return (
    <Style.Container>
      <Navbar logoWidth={120} onSidebarToggle={onSidebarToggle} />
      <Sidebar open={sidebarOpen} />
      <Style.Content sidebarOpen={sidebarOpen}>{props.children}</Style.Content>
    </Style.Container>
  );
}

export default MainScreen;
