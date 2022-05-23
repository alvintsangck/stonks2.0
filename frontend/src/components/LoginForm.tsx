import "../css/LoginForm.css";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../redux/auth/api";
import { defaultErrorSwal } from "./ReactSwal";
import FacebookLogin, { ReactFacebookLoginInfo } from "react-facebook-login";
import { useNavigate } from "react-router-dom";

export type LoginFormState = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const navigate = useNavigate();
  //   const location = useLocation();
  const [login, result] = useLoginMutation();
  const { register, handleSubmit } = useForm<LoginFormState>({ defaultValues: { username: "", password: "" } });
  const signIn = "Sign in";

  function onSubmit(data: LoginFormState) {
    if (data.username && data.password) {
      login({ username: data.username, password: data.password });
      if (result.isSuccess) {
        localStorage.setItem('token', result.data)
        navigate("/portfolio");
      }
    } else {
      defaultErrorSwal("username or password cannot be empty");
    }
  }

  const fBOnClick = () => {
    return null;
  };

  const fBCallback = (userInfo: ReactFacebookLoginInfo & { accessToken: string }) => {
    if (userInfo.accessToken) {
      //   dispatch(loginFacebookThunk(userInfo.accessToken));
    }
    return null;
  };

  return (
    <Form id="login-form" onSubmit={handleSubmit(onSubmit)}>
      <h1>{signIn}</h1>
      <div className="social-container">
        <FacebookLogin
          appId={process.env.REACT_APP_FACEBOOK_APP_ID || ""}
          autoLoad={false}
          fields="name,email,picture"
          onClick={fBOnClick}
          callback={fBCallback}
          icon="fa-facebook"
          isDisabled
        />
      </div>
      <span>or use your account</span>
      <Form.Control
        type="text"
        {...register("username", { required: true })}
        placeholder="Username / Email"
      ></Form.Control>
      <Form.Control type="password" {...register("password", { required: true })} placeholder="Password"></Form.Control>
      <button type="submit">{signIn}</button>
    </Form>
  );
}
