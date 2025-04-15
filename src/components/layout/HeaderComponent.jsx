import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
const { Header } = Layout;

function HeaderComponent() {
  
  const location = useLocation();
  const menuItems = [
    {
      key: "/design-maker/766",
      label: <Link to="/design-maker/766">Home</Link>,
    },
  ];

  return (
    <Header className="bg-white shadow-md !px-0 sticky top-0 z-50">
      <Menu
        mode="horizontal flex justify-center"
        selectedKeys={[location.pathname]}
        items={menuItems}
      />
    </Header>
  );
}
export default HeaderComponent;
