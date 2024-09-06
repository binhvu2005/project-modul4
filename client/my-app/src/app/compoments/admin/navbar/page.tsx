import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <div className="side-navbar">
        <span>Menu chính</span>
        <Link href="/pages/admin/home" className="active">
          Trang chủ
        </Link>
        <Link href="/pages/admin/userMananger">Quản lí tài khoản</Link>
        <Link href="/Pages/adminSubject.html">Quản lí môn thi</Link>
        <Link href="/Pages/adminChat.html">Chat</Link>
        <div className="links">
          <span>Quick Link</span>
          <Link href="#">Github</Link>
          <Link href="#">Youtube</Link>
          <Link href="#">Google</Link>
        </div>
      </div>
    </div>
  );
}
