import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import GeneratorForm from "./components/GeneratorForm";
import ImageDisplay from "./components/ImageDisplay";
import ProductPreview from "./components/ProductPreview";
import TShirtCustomizer from "./pages/TShirtCustomizer";
import DesignMakerApp from "./components/design-maker/DesignMakerApp";
import "@ant-design/v5-patch-for-react-19";
import { Layout, Menu } from "antd";

const { Header, Content } = Layout;

function AppRoutes({ generatedImageUrl }) {
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
      key: "/design-maker/123",
      label: <Link to="/design-maker/123">Design Maker</Link>,
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
            element={<Navigate to="/design-maker/123" replace />}
          />
          <Route
            path="/customizer"
            element={<TShirtCustomizer imageUrl={generatedImageUrl} />}
          />
          <Route path="/design-maker/:productId" element={<DesignMakerApp />} />
        </Routes>
      </Content>
    </Layout>
  );
}

function App() {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <Router>
      <AppRoutes generatedImageUrl={generatedImageUrl} />
    </Router>
  );
}

export default App;
