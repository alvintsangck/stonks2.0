import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../../css/LoginForm.css";
import { useLoginMutation } from "../../redux/auth/api";
import { defaultErrorSwal } from "../../util/ReactSwal";

export type LoginFormState = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const navigate = useNavigate();
  const [login, result] = useLoginMutation();
  const { register, handleSubmit } = useForm<LoginFormState>({ defaultValues: { username: "", password: "" } });
  const signIn = "Sign in";

  function onSubmit(data: LoginFormState) {
    if (data.username && data.password) {
      login({ username: data.username, password: data.password });
      if (result.isSuccess) {
        localStorage.setItem("token", result.data);
        navigate("/portfolio");
      }
    } else {
      defaultErrorSwal("username or password cannot be empty");
    }
  }

  return (
    <Form id="login-form" onSubmit={handleSubmit(onSubmit)}>
      <h1>{signIn}</h1>
      <div className="social-container"></div>
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
