import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ReactSwal = withReactContent(Swal);

export function defaultErrorSwal(error: any) {
	ReactSwal.fire({
		toast: true,
		position: "top",
		showConfirmButton: false,
		timer: 2000,
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
