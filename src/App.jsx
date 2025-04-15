import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DesignMakerApp from "./components/design-maker/DesignMakerApp";
import "@ant-design/v5-patch-for-react-19";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/design-maker/:productId" element={<DesignMakerApp />} />
      </Routes>
    </Router>
  );
}

export default App;
