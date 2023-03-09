import { fireSweetAlert } from "components/SweetAlerts";

import SuccessAlert from "./SuccessAlert";

const fireSuccessAlert = (txId: string) =>
  fireSweetAlert({
    toast: true,
    position: "top-end",
    icon: "success",
    timer: 30_000,
    showConfirmButton: false,
    timerProgressBar: true,
    html: <SuccessAlert txId={txId} />,
  });

export default fireSuccessAlert;
