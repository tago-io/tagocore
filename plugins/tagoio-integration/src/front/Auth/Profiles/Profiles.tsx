import { FormGroup } from "@tago-io/tcore-console";
import * as Style from "./Profiles.style";

/**
 */
function Profiles(props: any) {
  const { profiles, onChooseProfile, onSignOut, loading } = props;

  return (
    <Style.Container loading={loading}>
      <FormGroup>
        <div className="title-container">
          <h3>Select a Profile</h3>
          <span className="fake-link" onClick={onSignOut}>
            Sign out
          </span>
        </div>
      </FormGroup>

      {profiles.map((x: any) => (
        <div className="item" key={x.id} onClick={() => onChooseProfile(x.id)}>
          <span>{x.name}</span>
        </div>
      ))}
    </Style.Container>
  );
}

export default Profiles;
