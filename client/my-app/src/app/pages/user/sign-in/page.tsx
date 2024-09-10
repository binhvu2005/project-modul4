"use client"

import React, { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import "@/app/styles/login.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Link from 'next/link';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors((prev) => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrors((prev) => ({ ...prev, password: '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formErrors: { [key: string]: string } = {};
    if (!email) formErrors.email = 'Email không được để trống';
    if (!password) formErrors.password = 'Mật khẩu không được để trống';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/userList');
      const users = response.data;

      const currentUser = users.find(
        (user: any) => user.email === email
      );

      if (currentUser) {
        // Decrypt the password from the database
        const decryptedPassword = CryptoJS.AES.decrypt(currentUser.password, 'your-secret-key').toString(CryptoJS.enc.Utf8);

        if (decryptedPassword === password) {
          if (currentUser.lock === 'lock') {
            Swal.fire({
              icon: 'error',
              title: 'Tài khoản bị khóa',
              text: 'Tài khoản này đã bị khóa!',
            });
          } else {
            localStorage.setItem('keyLogin', currentUser.id);
            await axios.patch(`http://localhost:5000/userList/${currentUser.id}`, { status: 1 });
            Swal.fire({
              icon: 'success',
              title: 'Đăng nhập thành công',
              text: 'Bạn đã đăng nhập thành công!',
            }).then(() => {
              router.push('/pages/user/home'); // điều hướng tới trang home
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Đăng nhập thất bại',
            text: 'Tài khoản hoặc mật khẩu không đúng!',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại',
          text: 'Tài khoản hoặc mật khẩu không đúng!',
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Có lỗi xảy ra trong quá trình đăng nhập!',
      });
    }
  };

  return (
    <section className="vh-100" style={{ marginTop: "-64px" }}>
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <div style={{ textAlign: 'center', fontSize: '45px' }}>
              ĐĂNG NHẬP
            </div>
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample image"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form id="loginForm" onSubmit={handleSubmit}>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  type="email"
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

              <div className="form-outline mb-3">
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

              <div className="d-flex justify-content-between align-items-center">
                <div className="form-check mb-0">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    value=""
                    id="form2Example3"
                  />
                  <label className="form-check-label" htmlFor="form2Example3">
                    Lưu mật khẩu
                  </label>
                </div>
                <a href="#!" className="text-body">Quên mật khẩu?</a>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                >
                  Đăng nhập
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Bạn chưa có tài khoản?{' '}
                  <Link href="/pages/user/sign-up" className="link-danger">Đăng kí</Link> tại đây
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
