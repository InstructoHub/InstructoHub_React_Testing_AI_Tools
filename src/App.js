import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthoringToolLandingPage from './pages/AuthoringTool/LandingPage';
import VideoEngineLandingPage from './pages/VideoEngine/LandingPage';
import VideoEngineChatBot from './pages/VideoEngine/ChatBot';
import './App.css';
function App() {
  return (
    <Router>
      <Routes>
          <Route path="/1" element={<AuthoringToolLandingPage />} />
          <Route path="/2" element={<VideoEngineLandingPage />} />
          <Route path="/2" element={<VideoEngineChatBot />} />
      </Routes>
    </Router>
  );
}
export default App;