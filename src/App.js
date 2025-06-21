import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { CreatePostPage } from "./pages/CreatePostPage"; // adjust path if needed
function App() {
    return (_jsxs("div", { children: [_jsx(Navbar, {}), _jsx("div", { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/create", element: _jsx(CreatePostPage, {}) })] }) })] }));
}
export default App;
