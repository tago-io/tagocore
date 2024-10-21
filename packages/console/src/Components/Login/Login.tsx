import axios from "axios";
import { useEffect, useCallback, useState } from "react";
import { useHistory } from "react-router";
import setDocumentTitle from "../../Helpers/setDocumentTitle.ts";
import { setLocalStorage } from "../../Helpers/localStorage.ts";
import getAccountByToken from "../../Requests/getAccountByToken.ts";
import store from "../../System/Store.ts";
import SetupBackground from "../Setup/SetupBackground/SetupBackground.tsx";
import * as Style from "./Login.style";
import Form from "./LoginForm/LoginForm.tsx";
import Welcome from "./Welcome/Welcome.tsx";

/**
 * Main login component (form + background).
 */
function Login() {
  const [data, setData] = useState<any>({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  /**
   * Validates credentials for signing in.
   * @returns {boolean} true for error.
   */
  const validateSignIn = useCallback(() => {
    const err: any = {};
    let hasError = false;

    if (!data.username) {
      err.username = true;
      hasError = true;
    }
    if (!data.password) {
      err.password = true;
      hasError = true;
    }

    setError(err);
    return hasError;
  }, [data]);

  /**
   * Signs in and sends the user to the /console root.
   */
  const signIn = useCallback(() => {
    if (validateSignIn()) {
      return;
    }

    setLoading(true);
    setError({});

    axios
      .post("/account/login", data)
      .then((r) => {
        setLocalStorage("token", r.data.result);
        store.token = r.data.result;

        getAccountByToken(r.data.result).then((account) => {
          setLoading(false);
          store.account = account;
          history.push("/console");
        });
      })
      .catch((err) => {
        const errorMessage = err?.response?.data?.message || err?.toString?.();
        setError({ message: errorMessage, username: true, password: true });
        setLoading(false);
      });
  }, [validateSignIn, history, data]);

  /**
   * Sets the document title.
   */
  useEffect(() => {
    setDocumentTitle("Login");
  }, []);

  return (
    <Style.Container>
      <SetupBackground />

      <div className="front">
        <Welcome />
        <Form
          data={data}
          error={error}
          loading={loading}
          onChangeData={setData}
          onSignIn={signIn}
        />
      </div>
    </Style.Container>
  );
}

export default Login;
