import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../../css/RegisterForm.css";
import { useRegisterMutation } from "../../redux/auth/api";
import { defaultErrorSwal } from "../../util/ReactSwal";

export type RegisterFormState = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const navigate = useNavigate();
  const [registerUser, result] = useRegisterMutation();
  const { register, handleSubmit } = useForm<RegisterFormState>({
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });
  const onSubmit = (data: RegisterFormState) => {
    const isValidate = validateInput(data);
    if (isValidate) {
      registerUser({
        username: data.username,
        password: data.password,
        confirmPassword: data.confirmPassword,
        email: data.email,
      });
    }
    if (result.isSuccess) {
      navigate(`/portfolio`);
    }
  };
  return (
    <Form id="register-form" onSubmit={handleSubmit(onSubmit)}>
      <h1>Create Account</h1>
      <img id="avatar-preview" src="/STONK.png" alt="avatar"></img>
      <input type="text" {...register("username")} placeholder="Username" />
      <input type="email" {...register("email")} placeholder="Email" />
      <input type="password" {...register("password")} placeholder="Password" />
      <input type="password" {...register("confirmPassword")} placeholder="Confirm Password" />
      {/* 
			<Form.Group className="tos">
				<input type="checkbox" name="terms" id="terms-checkbox" />
				<Form.Label>I agree to the Terms of Services</Form.Label>
			</Form.Group> */}
      <button type="submit">Sign Up</button>
    </Form>
  );
}

function validateInput(data: RegisterFormState) {
  const space = /s+/g;
  const { username, email, password, confirmPassword } = data;
  if (username.replace(space, "") === "") {
    defaultErrorSwal("Username cannot be empty.");
    return false;
  }
  if (email.replace(space, "") === "") {
    defaultErrorSwal("Email cannot be empty.");
    return false;
  }
  if (password.replace(space, "") === "") {
    defaultErrorSwal("Password cannot be empty.");
    return false;
  }
  if (username.match(/@/)) {
    defaultErrorSwal("Cannot use @ in username.");
    return false;
  }
  if (password !== confirmPassword) {
    defaultErrorSwal("The passwords you entered do not match.");
    return false;
  }
  return true;
}
