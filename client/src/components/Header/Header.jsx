import React, { useRef } from "react";
import "./Header.scss";
import AppIcon from "../../../public/flower.png";
import SegmentedControl from "../SegmentTab/SegmentTab";
import appConstant from "../../services/appConstant";
import { Button, Input } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const Header = ({ dbType, onChangeSearchType, onRateChange, ratePer, onChangeFileType }) => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState({});

  React.useEffect(() => {
    if (localStorage.getItem(appConstant.authToken)) {
      setUser(JSON.parse(localStorage.getItem(appConstant.authToken))?.user);
    }
  }, []);
  return (
    <section className='main-header'>
      <div className='app-icon'>
        <img src={AppIcon} alt='meltingflower' />
        <span style={{ color: "#fff", margin: 0, display: "block", width: "110px" }}>{user?.name}</span>
      </div>
      <div className='search-type-opts'>
        <div>
          <h2>Search by</h2>
          <SegmentedControl
            name='search-tab'
            callback={onChangeSearchType}
            controlRef={useRef()}
            defaultIndex={0}
            segments={[
              {
                label: "Text",
                value: "text",
                ref: useRef(),
              },
              {
                label: "Image",
                value: "image",
                ref: useRef(),
              },
            ]}
          />
          <h2 style={{ margin: 0 }}>from</h2>
          <SegmentedControl
            name='file-tab'
            callback={onChangeFileType}
            controlRef={useRef()}
            defaultIndex={0}
            segments={[
              {
                label: "Master",
                value: "Master",
                ref: useRef(),
              },
              {
                label: "Mandap",
                value: "Mandap",
                ref: useRef(),
              },
            ]}
          />
          <Button
            onClick={() => {
              localStorage.removeItem(appConstant.authToken);
              navigate("/");
            }}>
            Logout
          </Button>
        </div>
        {dbType === "Mandap" && (
          <Input
            className='rate_per_input'
            onChange={onRateChange}
            value={ratePer}
            min={0}
            type='number'
            label={{ basic: true, content: "%" }}
            labelPosition='right'
            placeholder='Enter Rate'
          />
        )}
      </div>
    </section>
  );
};

export default Header;
