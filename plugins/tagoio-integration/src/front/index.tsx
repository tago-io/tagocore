import { GlobalStyles, theme } from "@tago-io/tcore-console";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import App from "./App.tsx";

ReactDOM.render(
  <ThemeProvider theme={theme.lightTheme}>
    <GlobalStyles />
    <App />
  </ThemeProvider>,
  document.getElementById("root"),
);
