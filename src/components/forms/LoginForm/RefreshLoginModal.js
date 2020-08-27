import React, { useState, useEffect, useRef, useContext } from "react";
import { Alert, Button } from "react-bootstrap";
import LoginForm from "./LoginForm";
import Modal from "../../Modal";
import gpib from "../../../apis/gpib";
import axios from "axios";
import { AuthContext } from "components/Auth";

let pendingRequests = [];

const RefreshLoginModal = () => {
  const { logout } = useContext(AuthContext);
  const [isOpen, setOpen] = useState(false);
  const el = useRef(null);
  const onDismiss = () => setOpen(false);
  const onLogin = () => {
    const { token } = JSON.parse(localStorage.getItem("user"));
    pendingRequests.forEach(({ config, res }) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      res(axios(config));
    });
    pendingRequests = [];
    onDismiss();
  };

  const onCancel = () => {
    setOpen(false);
    pendingRequests = pendingRequests.forEach(({ res }) => res());
    pendingRequests = [];
    logout();
  };

  // Hide/Show other modals if 401 received while modal is open
  useEffect(() => {
    if (!el.current) return;
    const children = document.querySelector("#modal").children;
    if (isOpen) {
      Object.keys(children).forEach((key) => {
        if (!children[key].contains(el.current))
          children[key].style.display = "none";
      });
    } else {
      Object.keys(children).forEach((key) => {
        if (!children[key].contains(el.current))
          children[key].style.display = "block";
      });
    }
  }, [isOpen]);

  // Catch any 401 errors
  useEffect(() => {
    gpib.secure.interceptors.response.use(
      (res) => res,
      async (e) => {
        const original = e.config;
        if (e?.response?.status !== 401) throw e;
        setOpen(true);
        return new Promise((res) =>
          pendingRequests.push({ config: original, res })
        );
      }
    );
  }, []);

  return isOpen ? (
    <Modal isOpen={isOpen} onDismiss={onDismiss} heading="Login" noExit>
      <div ref={el}>
        <Alert variant="primary" children="Your session has expired." />
        <LoginForm onLogin={onLogin} noReset />
        <Button
          variant="light"
          block
          children="Cancel"
          className="mt-3"
          onClick={onCancel}
        />
      </div>
    </Modal>
  ) : null;
};

export default RefreshLoginModal;
