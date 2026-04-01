import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home/home";
import About from "./pages/about/about";
import CreateCampaign from "./pages/createCampaign";
import Graphics from "./pages/graphics";
import Settings from "./pages/settings";
import Templates from "./pages/templates";
import Users from "./pages/users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/create" element={<CreateCampaign />} />
        <Route path="/graphics" element={<Graphics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;