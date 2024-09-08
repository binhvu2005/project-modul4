import { SignOutButton, UserButton } from '@clerk/nextjs';
import React from 'react';


export default function Page() {
  
  return (
    <div>
      <header className="header-admin">
        <div className="logo-search-container">
          <div>
            <img
              src="https://static.vecteezy.com/system/resources/previews/009/182/690/original/thi-letter-logo-design-with-polygon-shape-thi-polygon-and-cube-shape-logo-design-thi-hexagon-logo-template-white-and-black-colors-thi-monogram-business-and-real-estate-logo-vector.jpg"
              alt="Logo"
              className="logo"
              style={{ width: 50, height: 50 }}
            />
            <span>OnlineTest</span>
          </div>
        </div>
        <div className="header-icons">
        <SignOutButton>
          <button>Sign out</button>
        </SignOutButton>
          <UserButton />
        </div>
      </header>
    </div>
  );
}
