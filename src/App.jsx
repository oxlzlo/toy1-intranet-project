import NoticeToy from "./components/NoticeToy";
import NoticeSatisfaction from "./components/NoticeSatisfaction";
import NoticeBonus from "./components/NoticeBonus";
import NoticeEvent from "./components/NoticeEvent";
import { Routes, Route } from "react-router-dom";
import NoticePage from "./components/NoticePage";
import Reference from "./components/Reference";
import LayoutPage from "./pages/LayoutPage";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import JoinPage from "./pages/JoinPage";
import ComponentsPage from "./pages/ComponentsPage";
import ApplyListPage from "./pages/ApplyListPage";
import ApplyFormPage from "./pages/ApplyFormPage";
import MyPage from "./pages/MyPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/join" element={<JoinPage />} />

        <Route element={<LayoutPage />}>
          <Route path="/main" element={<MainPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/notice-toy" element={<NoticeToy />} />
          <Route path="/notice-satisfaction" element={<NoticeSatisfaction />} />
          <Route path="/notice-bonus" element={<NoticeBonus />} />
          <Route path="/notice-event" element={<NoticeEvent />} />
          <Route path="/apply-form" element={<ApplyFormPage />} />
          <Route path="/apply-list" element={<ApplyListPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/ref" element={<MyPage />} />
          <Route path="/reference" element={<Reference />} />
          <Route path="/components" element={<ComponentsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
