import NavbarComp from "@/components/Navbar";
import React from "react";

function UserLayout({ children }) {
  return (
    <div>
      <NavbarComp />

      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}

export default UserLayout;
