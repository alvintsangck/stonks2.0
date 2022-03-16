import "../css/LoginForm.css";
import { Form } from "react-bootstrap";
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { loginThunk } from "../redux/auth/thunk";
import { RootState } from "../redux/store/state";
import { defaultErrorSwal } from "./ReactSwal";
import { useLocation } from "react-router";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export type LoginFormState = {
	username: string;
	password: string;
};

export default function LoginForm() {
	const dispatch = useDispatch();
	const location = useLocation<any>();
	const error = useSelector((state: RootState) => state.auth.error);
	const { register, handleSubmit } = useForm<LoginFormState>({ defaultValues: { username: "", password: "" } });
	const signIn = "Sign in";

	function onSubmit(data: LoginFormState) {
		if (data.username && data.password) {
			dispatch(loginThunk(data, location.state ? location.state.from.pathname : "/portfolio"));
		} else {
			defaultErrorSwal("username or password cannot be empty");
		}
	}

	return (
		<Form id="login-form" onSubmit={handleSubmit(onSubmit)}>
			<h1>{signIn}</h1>
			<div className="social-container">
				<FontAwesomeIcon icon={faGoogle as IconProp} />
				<FontAwesomeIcon icon={faFacebookF as IconProp} />
			</div>
			<span>or use your account</span>
			<Form.Control
				type="text"
				{...register("username", { required: true })}
				placeholder="Username / Email"
			></Form.Control>
			<Form.Control
				type="password"
				{...register("password", { required: true })}
				placeholder="Password"
			></Form.Control>
			<button type="submit">{signIn}</button>
			{error && defaultErrorSwal(error)}
		</Form>
	);
}
