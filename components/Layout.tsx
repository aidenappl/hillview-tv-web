import Navbar from "./Navbar/Navbar";

interface LayoutProps {
  children: any;
}

const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <div className="primary-container">
      <Navbar hideLinks={false} />
      {children}
    </div>
  );
};

export default Layout;
