import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import setDocumentTitle from "../../Helpers/setDocumentTitle.ts";
import uninstallPlugin from "../../Requests/uninstallPlugin.ts";
import { ModalUninstallPlugin } from "../../index.ts";
import ModalInstallPlugin from "../Plugins/Common/ModalInstallPlugin/ModalInstallPlugin.tsx";

/**
 * Props.
 */
interface IPageIFrameProps {
  title: string;
}

/**
 * Renders an iframe of a plugin page.
 */
function PageIFrame(props: IPageIFrameProps) {
  const { title } = props;
  const ref = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();

  const [modalInstall, setModalInstall] = useState(""); // src of plugin
  const [modalUninstall, setModalUninstall] = useState(""); // id of plugin

  const pageURL = window.location.pathname.replace("/console/", "");

  /**
   * Used to handle messages from the iframe.
   */
  useEffect(() => {
    function onMessage(e: any) {
      const type = e?.data?.type;

      if (type === "install-plugin") {
        setModalInstall(e.data.url);
      } else if (type === "uninstall-plugin") {
        setModalUninstall(e.data.pluginID);
      } else if (type === "set-link") {
        const split = String(e.data.url)
          .split("/")
          .filter((x) => x);

        if (split[0] === "pages") {
          split.splice(0, 1); // remove the first /pages
        }

        const newURL = split.join("/");
        if (newURL !== pageURL) {
          navigate(`/console/${newURL}`);
        }
      }
    }

    setDocumentTitle(title);

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [pageURL, navigate, title]);

  return (
    <>
      <iframe
        frameBorder="0"
        ref={ref}
        src={`/pages/${pageURL}`}
        style={{ width: "100%", height: "100%" }}
      />

      {modalInstall && (
        <ModalInstallPlugin
          source={modalInstall}
          onClose={() => window.location.reload()}
        />
      )}

      {modalUninstall && (
        <ModalUninstallPlugin
          onClose={() => setModalUninstall("")}
          onConfirm={(keepData) => uninstallPlugin(modalUninstall, keepData)}
        />
      )}
    </>
  );
}

export default PageIFrame;
