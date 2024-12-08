"use client";

import Button from "@/components/button/button.component";
import { useAppDispatch } from "@/lib/store/hooks";
import { addSnackbar, SnackbarData } from "@/lib/store/ui/ui.slice";

const types: { [Key in SnackbarData["type"]]: string } = {
  warning: "warning",
  error: "error",
  information: "information",
  success: "success",
};

const SnackbarsTestPage = () => {
  const dispatch = useAppDispatch();

  const add = () => {
    const i = Math.floor(Math.random() * 4);
    const type = Object.keys(types)[i] as SnackbarData["type"];
    dispatch(addSnackbar({ message: type, type: type }));
  };

  return (
    <div
      className="centralized-x"
      style={{ marginTop: "100px", paddingBottom: "100px" }}
    >
      <div className="centralized-y" style={{ width: "350px" }}>
        <Button onClick={add}>Add snackbar</Button>
      </div>
    </div>
  );
};

export default SnackbarsTestPage;
