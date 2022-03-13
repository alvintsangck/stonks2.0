import "../css/Login.css";
import { Container } from "react-bootstrap";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function Login() {
	return (
		<Container fluid className='login-container'>
			<div className="form-container">
				<div className="sign-up-container">
					<RegisterForm />
				</div>
				<div className="sign-in-container">
					<LoginForm />
				</div>
				<div className="overlay-container">
					<div className="overlay">
						<div className="overlay-panel overlay-left">
							<h1>Welcome Back!</h1>
							<p>To keep connected with us please login with your personal info</p>
							<button className="ghost" id="signIn">
								Sign In
							</button>
						</div>
						<div className="overlay-panel overlay-right">
							<h1>Hello, Friend!</h1>
							<p>Enter your personal details and start journey with us</p>
							<button className="ghost" id="signUp">
								Sign Up
							</button>
						</div>
					</div>
				</div>
			</div>
		</Container>
	);
}
