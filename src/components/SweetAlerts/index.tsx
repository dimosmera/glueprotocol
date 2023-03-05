import Swal, { SweetAlertOptions } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SweetAlert = withReactContent(Swal);

export const fireSweetAlert = (props: SweetAlertOptions) =>
  SweetAlert.fire({ ...props });

export const closeAlert = () => {
  Swal.close();
};

export const fireErrorAlert = (titleText?: string, timer?: number) =>
  fireSweetAlert({
    toast: true,
    position: "top-end",
    icon: "error",
    timer: timer || 5000,
    showConfirmButton: false,
    titleText:
      titleText ||
      "Something went wrong. Please reload the page and try again.",
  });
