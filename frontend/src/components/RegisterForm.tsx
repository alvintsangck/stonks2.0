import "../css/RegisterForm.css";
import { Form } from "react-bootstrap";

export default function RegisterForm() {
	return (
		<Form id="register-form">
			<h1>Create Account</h1>
			<img id="avatar-preview" src="/STONK.png" alt="avatar"></img>
			<input type="text" name="username" placeholder="Username" />
			<input type="email" name="email" placeholder="Email" />
			<input type="password" name="password" placeholder="Password" />
			<input type="password" name="confirmPassword" placeholder="Confirm Password" />

			<Form.Group className="tos">
				<Form.Check type="checkbox" />
				<input type="checkbox" name="terms" id="terms-checkbox" />
				<Form.Label>I agree to the Terms of Services</Form.Label>
			</Form.Group>
			<button>Sign Up</button>
		</Form>
	);
}

// validate: (value:string) => value.replace(/s+/g, "") !== '' || 'username is required'