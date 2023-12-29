import React from "react";
import "./LoginPage.scss";
import { Button, Checkbox, Form, Input, Message, Radio, Icon } from "semantic-ui-react";
import { isAuthenticated, userLogin, userVerifyOTP } from "../../services/authService";
import appConstant from "../../services/appConstant";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isPhoneExit, setPhoneExit] = React.useState(true);
  const [msg, setMsg] = React.useState("");
  const [errMsg, setErrMsg] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [phoneNo, setPhoneNo] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [otp, setOTP] = React.useState("");
  const [isAdmin, setAdmin] = React.useState(false);
  const [passType, setPassType] = React.useState("password");

  const onSubmitForm = async (e) => {
    setMsg("");
    e.preventDefault();
    if (!phoneNo) return setErrMsg("Please enter phone number");
    if (!isAdmin && !password) return setErrMsg("Please enter password");
    setErrMsg("");
    try {
      const result = await userLogin(phoneNo, password);
      if (result?.user?.role === "user") {
        localStorage.setItem(appConstant.authToken, JSON.stringify({ token: result.token, user: result.user }));
        navigate("/search");
      }
      setMsg(result.message);
    } catch (err) {
      console.log("err", err);
      setErrMsg(err.message);
    }
  };

  const onVerifyOTP = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!otp) return setErrMsg("Please enter phone number");
    setErrMsg("");
    try {
      const result = await userVerifyOTP(otp);
      setMsg(result.message);
      localStorage.setItem(appConstant.authToken, JSON.stringify({ token: result.token, user: result.user }));
      navigate("/search");
      setOTP("");
    } catch (err) {
      console.log("err", err);
      setErrMsg(err.message);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated().isLoggedIn) {
      navigate("/search");
    }
  }, []);

  const onKeyDownOTP = (e) => {
    if (e.key === "Enter") {
      onVerifyOTP(e);
    }
  };
  const onKeyDownPass = (e) => {
    if (e.key === "Enter") {
      onSubmitForm(e);
    }
  };

  const passIcon = {
    password: <Icon link name='eye slash' onClick={() => setPassType("text")} />,
    text: <Icon link name='eye' onClick={() => setPassType("password")} />,
  };

  return (
    <section className='login_page_wrapper'>
      <main className='content'>
        {msg && <Message color='green'>{msg}</Message>}
        {errMsg && (
          <Message color='red' onDismiss={() => setErrMsg("")}>
            {errMsg}
          </Message>
        )}
        <h2 className='page_title'>Login</h2>
        <main className='login_form'>
          <div className='input_field'>
            {msg ? (
              <>
                <label className='input_label'>Enter OTP</label>
                <Input
                  type='number'
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  className='input_input'
                  error={errMsg}
                  onKeyDown={onKeyDownOTP}
                  name='otp'
                  placeholder='Enter OTP'
                />
              </>
            ) : (
              <>
                <label className='input_label'>Phone Number</label>
                <Input
                  type='text'
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  className='input_input'
                  error={!isPhoneExit}
                  name='phoneNo'
                  placeholder='Phone Number'
                />
                {!isAdmin && (
                  <>
                    <label className='input_label'>Password</label>
                    <Input
                      type={passType}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='input_input'
                      minlength='8'
                      icon={passIcon[passType]}
                      onKeyDown={onKeyDownPass}
                      name='password'
                      placeholder='Password'
                    />
                  </>
                )}
              </>
            )}
          </div>
          <div>
            <Checkbox label='Login as Admin' className='admin_checkbox' checked={isAdmin} onChange={(e, data) => setAdmin(data.checked)} />
          </div>

          <Button loading={loading} className='submit_btn' onClick={(e) => (msg ? onVerifyOTP(e) : onSubmitForm(e))} secondary>
            {msg ? "Submit" : "Login"}
          </Button>
        </main>
      </main>
    </section>
  );
};

export default LoginPage;
