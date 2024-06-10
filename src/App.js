import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import React from "react";
import { useAuthContext } from "./hooks/useAuthContext";
import Problem from "./pages/problem/Problem";
import Word from "./pages/word/Word";
import Wrong from "./pages/wrong/Wrong";
import Calendar from "./pages/calendar/Calendar";
import MyVoca from "./pages/myvoca/MyVoca";
import Result from "./pages/problem/result";
import IncorrectExplanation from "./pages/problem/Incorrect_explanation";
import Grades from "./pages/Grades/Grades";
import Eip from "./pages/eip/Eip";
import Eis from "./pages/eis/Eis";
import Ee from "./pages/ee/Ee";
import Efps from "./pages/efps/Efps";
import Ecs from "./pages/ecs/Ecs";

// 문제풀이 페이지 전 안내페이지
import Eip22_1 from "./pages/eip/Eip22_1";
import Eip22_2 from "./pages/eip/Eip22_2";
import Eis21_1 from "./pages/eis/Eis21_1";
import Eis21_2 from "./pages/eis/Eis21_2";
import Eis21_3 from "./pages/eis/Eis21_3";
import Ee22_1 from "./pages/ee/Ee22_1";
import Ee22_2 from "./pages/ee/Ee22_2";
import Efps21_1 from "./pages/efps/Efps21_1";
import Efps21_2 from "./pages/efps/Efps21_2";
import Efps21_4 from "./pages/efps/Efps21_4";
import Ecs22_1 from "./pages/ecs/Ecs22_1";
import Ecs22_2 from "./pages/ecs/Ecs22_2";

// 오답
import Bottom_nav from "./components/Bottom_nav";

// 문제풀이 페이지
import Eip22_1_test from "./pages/eip/Eip22_1_test";
import Eip22_2_test from "./pages/eip/Eip22_2_test";
import Eis21_1_test from "./pages/eis/Eis21_1_test";
import Eis21_2_test from "./pages/eis/Eis21_2_test";
import Eis21_3_test from "./pages/eis/Eis21_3_test";
import Ee22_1_test from "./pages/ee/Ee22_1_test";
import Ee22_2_test from "./pages/ee/Ee22_2_test";
import Efps21_1_test from "./pages/efps/Efps21_1_test";
import Efps21_2_test from "./pages/efps/Efps21_2_test";
import Efps21_4_test from "./pages/efps/Efps21_4_test";
import Ecs22_1_test from "./pages/ecs/Ecs22_1_test";
import Ecs22_2_test from "./pages/ecs/Ecs22_2_test";

// 단어 페이지
import Eip_word from "./pages/eip/Eip_word"; // 정보처리기사
import Eis_word from "./pages/eis/Eis_word"; // 산업안전기사
import Ecs_word from "./pages/ecs/Ecs_word"; // 건설안전기사
import Ee_word from "./pages/ee/Ee_word"; // 전기기사
import Efps_word from "./pages/efps/Efps_word"; // 소방설비기사

// 단어 선택 페이지
import Eip_myword from "./pages/eip/Eip_myword";

// 즐찾
import Eip_myvoca from "./pages/eip/Eip_myvoca"; // 정보처리기사
import Eis_myvoca from "./pages/eis/Eis_myvoca"; // 산업안전기사
import Ecs_myvoca from "./pages/ecs/Ecs_myvoca"; // 건설안전기사
import Ee_myvoca from "./pages/ee/Ee_myvoca"; // 전기기사
import Efps_myvoca from "./pages/efps/Efps_myvoca"; // 소방설비기사

// 마이페이지
import MyPage from './pages/mypage/MyPage';
import ProfileSetting from "./pages/mypage/ProfilesSetting";
import PasswordChangeScreen from "./pages/mypage/PassWordChangePage";
import DeleteAccount from "./pages/mypage/DeleteAccount";

function App() {
  const { isAuthReady, user } = useAuthContext();

  return (
    <div className="App">
      {isAuthReady ? (
        <BrowserRouter>
          <Nav />
          <AppRoutes user={user} />
        </BrowserRouter>
      ) : (
        "loading..."
      )}
    </div>
  );
}

function AppRoutes({ user }) {
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={!user ? <Navigate replace={true} to="/login" /> : <Home />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace={true} />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" replace={true} />}
        />
        <Route
          path="/problem/*"
          element={!user ? <Navigate to="/login" /> : <Problem />}
        />
        <Route
          path="/word"
          element={!user ? <Navigate to="/login" /> : <Word />}
        />
        <Route
          path="/wrong"
          element={!user ? <Navigate to="/login" /> : <Wrong />}
        />
        <Route
          path="/calendar"
          element={!user ? <Navigate to="/login" /> : <Calendar />}
        />
        <Route
          path="/my-voca"
          element={!user ? <Navigate to="/login" /> : <MyVoca />}
        />
        <Route path="/problem/eip" element={<Eip />} />
        <Route path="/problem/eis" element={<Eis />} />
        <Route path="/problem/ee" element={<Ee />} />
        <Route path="/problem/efps" element={<Efps />} />
        <Route path="/problem/ecs" element={<Ecs />} />
        <Route path="/problem/eip/eip22_1" element={<Eip22_1 />} />
        <Route path="/problem/eip/eip22_2" element={<Eip22_2 />} />
        <Route path="/problem/eis/eis21_1" element={<Eis21_1 />} />
        <Route path="/problem/eis/eis21_2" element={<Eis21_2 />} />
        <Route path="/problem/eis/eis21_3" element={<Eis21_3 />} />
        <Route path="/problem/ee/ee22_1" element={<Ee22_1 />} />
        <Route path="/problem/ee/ee22_2" element={<Ee22_2 />} />
        <Route path="/problem/efps/efps21_1" element={<Efps21_1 />} />
        <Route path="/problem/efps/efps21_2" element={<Efps21_2 />} />
        <Route path="/problem/efps/efps21_4" element={<Efps21_4 />} />
        <Route path="/problem/ecs/ecs22_1" element={<Ecs22_1 />} />
        <Route path="/problem/ecs/ecs22_2" element={<Ecs22_2 />} />

        <Route path="/problem/eip/eip22_1_test" element={<Eip22_1_test />} />
        <Route path="/problem/eip/eip22_2_test" element={<Eip22_2_test />} />
        <Route path="/problem/eis/eis21_1_test" element={<Eis21_1_test />} />
        <Route path="/problem/eis/eis21_2_test" element={<Eis21_2_test />} />
        <Route path="/problem/eis/eis21_3_test" element={<Eis21_3_test />} />
        <Route path="/problem/ee/ee22_1_test" element={<Ee22_1_test />} />
        <Route path="/problem/ee/ee22_2_test" element={<Ee22_2_test />} />
        <Route path="/problem/efps/efps21_1_test" element={<Efps21_1_test />} />
        <Route path="/problem/efps/efps21_2_test" element={<Efps21_2_test />} />
        <Route path="/problem/efps/efps21_4_test" element={<Efps21_4_test />} />
        <Route path="/problem/ecs/ecs22_1_test" element={<Ecs22_1_test />} />
        <Route path="/problem/ecs/ecs22_2_test" element={<Ecs22_2_test />} />

        <Route path="/incorrect-explanation" element={<IncorrectExplanation />} />
        <Route path="/pages/problem/result" element={<Result />} />
        <Route
          path="/grades"
          element={<Grades />}
        />

        <Route path="/pages/myvoca/MyVoca" element={<MyVoca />} />

        <Route path="/eip/Eip_word" element={<Eip_word />} />
        <Route path="/eis/Eis_word" element={<Eis_word />} />
        <Route path="/ecs/Ecs_word" element={<Ecs_word />} />
        <Route path="/ee/Ee_word" element={<Ee_word />} />
        <Route path="/efps/Efps_word" element={<Efps_word />} />

        <Route path="/eip/Eip_myword" element={<Eip_myword />} />

        <Route path="/eip/Eip_myvoca" element={<Eip_myvoca />} />
        <Route path="/eis/Eis_myvoca" element={<Eis_myvoca />} />
        <Route path="/ecs/Ecs_myvoca" element={<Ecs_myvoca />} />
        <Route path="/ee/Ee_myvoca" element={<Ee_myvoca />} />
        <Route path="/efps/Efps_myvoca" element={<Efps_myvoca />} />

        <Route path="/mypage" element={<MyPage />} />
        <Route path="/profile-settings" element={<ProfileSetting />} />
        <Route path="/password-change" element={<PasswordChangeScreen />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
      </Routes>
      {location.pathname !== "/login" && <Bottom_nav />}
    </>
  );
}

export default App;
