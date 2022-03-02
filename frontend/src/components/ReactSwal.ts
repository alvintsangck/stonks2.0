import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ReactSwal = withReactContent(Swal);

export function defaultErrorSwal(error: string) {
	ReactSwal.fire({
		toast: true,
		position: "top",
		showConfirmButton: false,
		timer: 1800,
		icon: "error",
		title: error,
	});
}

export function defaultSuccessSwal(msg: string) {
	ReactSwal.fire({
		toast: true,
		position: "top",
		showConfirmButton: false,
		timer: 1800,
		icon: "success",
		title: msg,
	});
}
