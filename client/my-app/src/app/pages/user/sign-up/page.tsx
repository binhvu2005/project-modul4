"use client";

import React, { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/app/styles/sign-up.css';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

// Utility functions

const validateEmail = (email: string) => {
  return String(email).toLowerCase().match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const validatePassword = (password: string) => {
  return password.length >= 6 && password.length <= 50;
};

const generateRandomId = () => {
  return Math.floor(10000 + Math.random() * 90000); // Random 5-digit number
};

const SignUp: React.FC = () => {
  const [nameAccount, setNameAccount] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  // Handle changes in form fields
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameAccount(e.target.value);
    setErrors((prev) => ({ ...prev, nameAccount: '' }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors((prev) => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrors((prev) => ({ ...prev, password: '' }));
  };

  const handleRePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRePassword(e.target.value);
    setErrors((prev) => ({ ...prev, rePassword: '' }));
  };

  // Function to check if email exists
  const checkEmailExists = async (email: string) => {
    try {
      const response = await axios.get('http://localhost:5000/userList');
      const accounts = response.data;
      return accounts.some((account: { email: string }) => account.email === email);
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formErrors: { [key: string]: string } = {};

    // Validate Name
    if (!nameAccount) formErrors.nameAccount = 'Tên không được để trống';

    // Validate Email
    if (!email) formErrors.email = 'Email không được để trống';
    else if (!validateEmail(email)) formErrors.email = 'Email không đúng định dạng';
    else if (email.length > 50) formErrors.email = 'Email quá dài';
    else if (await checkEmailExists(email)) formErrors.email = 'Email đã được sử dụng';

    // Validate Password
    if (!password) formErrors.password = 'Mật khẩu không được để trống';
    else if (!validatePassword(password)) formErrors.password = 'Mật khẩu phải từ 6 đến 50 ký tự';

    // Validate RePassword
    if (password !== rePassword) formErrors.rePassword = 'Mật khẩu không khớp';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Encrypt the password using AES before sending to the server
    const encryptedPassword = CryptoJS.AES.encrypt(password, 'your-secret-key').toString();

    try {
      const newUser = {
        id: `${generateRandomId()}`,
        nameAccount,
        email,
        password: encryptedPassword, // Encrypted password
        img: "https://th.bing.com/th/id/OIP._p7dSl1uR5eynQDkJyb1tgAAAA?rs=1&pid=ImgDetMain",
        status: 0,
      lock: "open",
      address: "chưa có",
      phone: "chưa có",
      result: []
      };

      const response = await axios.post('http://localhost:5000/userList', newUser);

      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Đăng kí thành công!',
          text: 'Bạn đã đăng kí tài khoản thành công.',
        }).then(() => {
          router.push('/pages/user/sign-in'); // Adjust the path if necessary
        });
      }
    } catch (error) {
      console.error('There was an error!', error);
      Swal.fire({
        icon: 'error',
        title: 'Đăng kí thất bại',
        text: 'Có lỗi xảy ra trong quá trình đăng kí. Vui lòng thử lại sau.',
      });
    }
  };

  return (
    <section className="h-80 bg-dark">
      <form id="signup" onSubmit={handleSubmit}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col">
              <div className="card card-registration my-4">
                <div className="row g-0">
                  <div className="col-xl-6 d-none d-xl-block">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                      className="img-fluid"
                      alt="Sample image"
                    />
                  </div>
                  <div className="col-xl-6" style={{ marginTop: "-70px", maxHeight: "650px" }}>
                    <div className="card-body p-md-5 text-black">
                      <h3 className="mb-5 text-uppercase">Đăng kí</h3>

                      {/* Input for name */}
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="name">Tên đăng kí</label>
                        <input
                          type="text"
                          id="name"
                          className="form-control form-control-lg"
                          placeholder="Nhập tên"
                          value={nameAccount}
                          onChange={handleNameChange}
                        />
                        {errors.nameAccount && (
                          <div style={{ color: 'red' }}>{errors.nameAccount}</div>
                        )}
                      </div>

                      {/* Input for email */}
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                          type="text"
                          id="email"
                          className="form-control form-control-lg"
                          placeholder="Nhập email"
                          value={email}
                          onChange={handleEmailChange}
                        />
                        {errors.email && (
                          <div style={{ color: 'red' }}>{errors.email}</div>
                        )}
                      </div>

                      {/* Input for password */}
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="password">Mật khẩu</label>
                        <input
                          type="password"
                          id="password"
                          className="form-control form-control-lg"
                          placeholder="Nhập mật khẩu"
                          value={password}
                          onChange={handlePasswordChange}
                        />
                        {errors.password && (
                          <div style={{ color: 'red' }}>{errors.password}</div>
                        )}
                      </div>

                      {/* Input for password confirmation */}
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="rePassword">Xác nhận mật khẩu</label>
                        <input
                          type="password"
                          id="rePassword"
                          className="form-control form-control-lg"
                          placeholder="Nhập lại mật khẩu"
                          value={rePassword}
                          onChange={handleRePasswordChange}
                        />
                        {errors.rePassword && (
                          <div style={{ color: 'red' }}>{errors.rePassword}</div>
                        )}
                      </div>

                      {/* Link to sign-in */}
                      <div className="text-center">
                        <p className="mb-0">Bạn đã có tài khoản? <Link href="/pages/user/sign-in">Đăng nhập</Link></p>
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                          style={{ backgroundColor: '#3949ab' }}
                        >
                          Đăng kí
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default SignUp;
