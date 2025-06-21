import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import {CreatePostPage} from "./pages/CreatePostPage"; // adjust path if needed
function App() {
    return (
        <div>
            <Navbar />
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create" element={<CreatePostPage />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
