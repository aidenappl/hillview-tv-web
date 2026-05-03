import React from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <div className="primary-container flex min-h-screen flex-col">
      <Navbar hideLinks={false} />
      <div id="main-content" className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
