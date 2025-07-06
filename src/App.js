import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthoringToolLandingPage from './pages/AuthoringTool/LandingPage';
import VideoEngineLandingPage from './pages/VideoEngine/LandingPage';
import VideoEngineChatBot from './pages/VideoEngine/ChatBot';
import './App.css';
function App() {
  return (
    <Router>
      <Routes>
          <Route path="/InstructoHub_React_Testing_AI_Tools/1" element={<AuthoringToolLandingPage />} />
          <Route path="/InstructoHub_React_Testing_AI_Tools/2" element={<VideoEngineLandingPage />} />
          <Route path="/InstructoHub_React_Testing_AI_Tools/3" element={<VideoEngineChatBot />} />
      </Routes>
    </Router>
  );
}
export default App;