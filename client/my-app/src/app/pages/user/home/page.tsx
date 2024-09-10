import React from 'react'
import "@/app/styles/home.css"
import Banner from "@/app/compoments/user/banner/page"
import Banner2 from "@/app/compoments/user/banergv/page"
import Header from "@/app/compoments/user/header/page"
import Footer from "@/app/compoments/user/footer/page"

export default function page() {
  return (
    <div>
      <Header />
      <br /><br /><br />
      <Banner/>
      <br />
      <Banner2 />
      <Footer/>
    </div>
  )
}
