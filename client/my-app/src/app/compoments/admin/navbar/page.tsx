import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div>
      <div className="side-navbar">
  <span>Menu chính</span>
  <Link href="/pages/admin/home">Trang chủ</Link>
  <Link href="/pages/admin/userMananger">Quản lí tài khoản</Link>
  <Link href="/pages/admin/coursesMananger" >
    Quản lí khoá thi
  </Link>
  <div className="links">
    <span>Quick Link</span>
    <a href="#">Github</a>
    <a href="#">Youtube</a>
    <a href="#">Google</a>
  </div>
</div>

    </div>
  )
}
