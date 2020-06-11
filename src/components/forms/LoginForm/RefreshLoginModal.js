import React, { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-bootstrap';
import LoginForm from './LoginForm';
import Modal from '../../Modal';
import gpib from '../../../apis/gpib';
import axios from 'axios';

let resolveLoginPromise = null;
let pendingRequests = [];

const RefreshLoginModal = () => {
  const [isOpen, setOpen] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);
  const el = useRef(null);
  const onDismiss = () => setOpen(false);
  const onLogin = () => {
    if (resolveLoginPromise) resolveLoginPromise();
    onDismiss();
  };

  // Hide/Show other modals if 401 received while modal is open
  useEffect(() => {
    if (!el.current) return;
    const children = document.querySelector('#modal').children;
    if (isOpen) {
      Object.keys(children).forEach((key) => {
        if (!children[key].contains(el.current))
          children[key].style.display = 'none';
      });
    } else {
      Object.keys(children).forEach((key) => {
        if (!children[key].contains(el.current))
          children[key].style.display = 'block';
      });
    }
  }, [isOpen]);

  useEffect(() => {
    gpib.secure.interceptors.response.use(
      (res) => res,
      async (e) => {
        const original = e.config;
        if (e.response.status === 401) {
          if (isRefreshing) {
            return new Promise(
              (resolve) =>
                (pendingRequests = [
                  ...pendingRequests,
                  { config: original, resolve }
                ])
            );
          }
          setRefreshing(true);
          setOpen(true);
          const loginPromise = new Promise((res) => {
            resolveLoginPromise = res;
          });
          await loginPromise;
          const user = JSON.parse(localStorage.getItem('user'));
          const { token } = user;
          pendingRequests.forEach(({ config, res }) => {
            if (token) config.headers.Authorization = `Bearer ${token}`;
            res(axios(config));
          });
          original.headers.Authorization = `Bearer ${token}`;
          pendingRequests = [];
          resolveLoginPromise = null;
          return axios(original);
        }
        throw e;
      }
    );
  }, [isRefreshing]);

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} heading="Login" noExit>
      <div className="py-3" ref={el}>
        <Alert variant="primary" children="Your session has expired." />
        <LoginForm noRedirect onLogin={onLogin} />
      </div>
    </Modal>
  );
};

export default RefreshLoginModal;
