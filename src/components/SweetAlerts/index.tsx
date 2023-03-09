import { Inter } from "next/font/google";
import Swal, { SweetAlertOptions } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const inter = Inter({ subsets: ["latin"] });

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
    title: (
      <p className={inter.className}>
        {titleText ||
          "Something went wrong. Please reload the page and try again"}
      </p>
    ),
  });

export const fireLoadingAlert = (titleText?: string) =>
  fireSweetAlert({
    didOpen: () => SweetAlert.showLoading(),
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    title: <p className={inter.className}>{titleText || "Loading"}</p>,
  });
