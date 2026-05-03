import React from "react";
import Navbar from "./Navbar/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <div className="primary-container">
      <Navbar hideLinks={false} />
      <div id="main-content">{children}</div>
    </div>
  );
};

export default Layout;
