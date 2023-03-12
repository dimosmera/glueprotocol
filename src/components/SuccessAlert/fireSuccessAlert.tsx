import { fireSweetAlert } from "components/SweetAlerts";

import SuccessAlert from "./SuccessAlert";

interface Props {
  txId?: string;
  successText?: string;
  timer?: number;
  timerProgressBar?: boolean;
}

const fireSuccessAlert = ({
  txId,
  timer = 30_000,
  timerProgressBar = true,
  successText,
}: Props) =>
  fireSweetAlert({
    toast: true,
    position: "top-end",
    icon: "success",
    timer,
    showConfirmButton: false,
    timerProgressBar,
    html: <SuccessAlert txId={txId} successText={successText} />,
  });

export default fireSuccessAlert;
