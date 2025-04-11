import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import DesignMakerApp from "./components/design-maker/DesignMakerApp";
import "@ant-design/v5-patch-for-react-19";
import { Layout, Menu } from "antd";

const { Header, Content } = Layout;

function AppRoutes() {
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      label: <Link to="/">Home</Link>,
    },
    {
      key: "/customizer",
      label: <Link to="/customizer">T-Shirt Customizer</Link>,
    },
    {
      key: "/design-maker/766",
      label: <Link to="/design-maker/766">Design Maker</Link>,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-md !px-0">
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ display: "flex", justifyContent: "center" }}
        ></Menu>
      </Header>

      <Content className="flex flex-col items-center justify-center bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/design-maker/766" replace />}
          />
          <Route
            path="/customizer"
            element={<Navigate to="/design-maker/766" replace />}
          />
          <Route path="/design-maker/:productId" element={<DesignMakerApp />} />
        </Routes>
      </Content>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
