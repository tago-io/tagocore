import { useApiRequest } from "@tago-io/tcore-console";
import type { IOSInfo } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import * as Style from "./Auth.style";
import Banner from "./Banner/Banner.tsx";
import Credentials from "./Credentials/Credentials.tsx";
import InstanceName from "./InstanceName/InstanceName.tsx";
import Otp from "./Otp/Otp.tsx";
import OtpPicker from "./OtpPicker/OtpPicker.tsx";
import Profiles from "./Profiles/Profiles.tsx";
import { REGIONS } from "./regions.ts";

/**
 * Props.
 */
interface IAuthProps {
  /**
   * Port of the integration server.
   */
  port: number;
  /**
   * Called when the user successfully signed in.
   */
  onSignIn: (tagocoreID: string) => void;
}

/**
 */
function Auth(props: IAuthProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("credentials");
  const [otpType, setOtpType] = useState<string>("authenticator");
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [lastPinCode, setLastPinCode] = useState("");
  const { data: osInfo } = useApiRequest<IOSInfo>("/hardware/os");
  const [otpTypesEnabled, setOtpTypesEnabled] = useState<string[]>([
    "authenticator",
    "email",
    "sms",
  ]);

  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] =
    useState<keyof typeof REGIONS>("us-e1");

  const { onSignIn, port } = props;

  // Get the API URL based on selected region
  const apiUrl = REGIONS[selectedRegion].apiUrl;

  /**
   * Logs in.
   */
  const login = useCallback(
    async (pinCode?: string) => {
      try {
        if (loading) {
          // prevent user clicking enter multiple times while focusing an input
          return;
        }

        setLoading(true);
        setInvalidCredentials(false);
        setLastPinCode(pinCode || "");

        // logs in and gets the account
        const result = await axios.post(
          `${apiUrl}/account/login`,
          {
            email,
            password,
            otp_type: pinCode ? otpType : undefined,
            pin_code: pinCode ? pinCode : undefined,
          },
          { validateStatus: () => true },
        );

        if (!result.data.status) {
          throw result.data;
        }

        setProfiles(result.data.result.profiles);
        setContent("profiles");
      } catch (ex: any) {
        const error = String(ex.message).includes("otp_enabled")
          ? JSON.parse(ex.message)
          : {};

        if (error.otp_enabled && error.otp_autosend) {
          setOtpType(error.otp_autosend);
          setOtpTypesEnabled(error.otp_enabled);
          setContent("otp");
        } else {
          setInvalidCredentials(true);
        }
      } finally {
        setLoading(false);
      }
    },
    [email, password, loading, otpType, apiUrl],
  );

  /**
   * Called when the user finishes the integration in the last step.
   */
  const startIntegration = async () => {
    try {
      setLoading(true);

      const location = window.location;
      const response = await axios({
        url: `${location.protocol}//${location.hostname}:${port}/start`,
        method: "POST",
        headers: {
          token,
          region: selectedRegion,
        },
        data: { name },
      });

      onSignIn(response.data.id);
    } catch (ex) {
      setLoading(false);
      throw ex;
    }
  };

  /**
   */
  const chooseProfile = useCallback(
    async (id: string) => {
      try {
        setLoading(true);

        // uses the account to get a profile token
        // logs in and gets the account
        const tokenData = await axios.post(`${apiUrl}/account/profile/token`, {
          email,
          password,
          otp_type: lastPinCode ? otpType : undefined,
          pin_code: lastPinCode ? lastPinCode : undefined,
          expire_time: "3 months",
          name: "Generated automatically by TagoCore",
          profile_id: id,
        });

        setToken(tokenData.data.result.token);
        setContent("instance-name");
      } catch (ex) {
        console.error(ex);
        setContent("credentials");
      } finally {
        setLoading(false);
      }
    },
    [email, otpType, lastPinCode, password, apiUrl],
  );

  /**
   * Switches to the OTP picker content.
   */
  const activateOtpPickerContent = useCallback(() => {
    setContent("otp-picker");
  }, []);

  /**
   * Switches to the OTP content.
   */
  const activateOtpContent = useCallback(() => {
    setContent("otp");
  }, []);

  /**
   * Switches to the credentials content.
   */
  const activateCredentialsContent = useCallback(() => {
    setLoading(false);
    setContent("credentials");
    setInvalidCredentials(false);
  }, []);

  /**
   * Switches the OTP type to another type.
   */
  const switchOtpType = useCallback(
    async (newType: string) => {
      setOtpType(newType);
      setContent("otp");

      if (newType !== "authenticator") {
        await axios.post(`${apiUrl}/account/login/otp`, {
          email,
          password,
          otp_type: newType,
        });
      }
    },
    [email, password, apiUrl],
  );

  /**
   * Sets the hostname.
   */
  useEffect(() => {
    if (osInfo?.hostname) {
      setName(osInfo.hostname);
    }
  }, [osInfo]);

  return (
    <Style.Container>
      <Style.Inner>
        <div className="left">
          <Style.Steps>
            <div className={content === "credentials" ? "selected" : ""} />
            <div className={content === "profiles" ? "selected" : ""} />
            <div className={content === "instance-name" ? "selected" : ""} />
          </Style.Steps>

          {content === "credentials" ? (
            // email and password
            <Credentials
              email={email}
              invalidCredentials={invalidCredentials}
              loading={loading}
              onChangeEmail={setEmail}
              onChangePassword={setPassword}
              onLogin={login}
              password={password}
              selectedRegion={selectedRegion}
              onChangeRegion={setSelectedRegion}
            />
          ) : content === "profiles" ? (
            // profile selection
            <Profiles
              loading={loading}
              onSignOut={activateCredentialsContent}
              onChooseProfile={chooseProfile}
              profiles={profiles}
            />
          ) : content === "otp-picker" ? (
            <OtpPicker
              types={otpTypesEnabled}
              onGoBack={activateOtpContent}
              onPick={switchOtpType}
            />
          ) : content === "otp" ? (
            // currently selected otp
            <Otp
              onGoToCredentials={activateCredentialsContent}
              onGoToOtpTypes={activateOtpPickerContent}
              onLogin={login}
              type={otpType}
              typesEnabled={otpTypesEnabled}
              loading={loading}
              invalidCredentials={invalidCredentials}
            />
          ) : (
            // instance name selection
            <InstanceName
              loading={loading}
              name={name}
              onChangeName={setName}
              onSignOut={activateCredentialsContent}
              onStart={startIntegration}
            />
          )}
        </div>

        <Banner />
      </Style.Inner>
    </Style.Container>
  );
}

export default Auth;
