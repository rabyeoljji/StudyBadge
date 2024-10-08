import { Route, Routes } from "react-router";
import Main from "../pages/Main";
import Error from "../pages/Error";
import ChannelPage from "../pages/ChannelPage";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ProfilePage from "../pages/ProfilePage";
import PaymentListPage from "../pages/PaymentListPage";
import Success from "../components/payment/Success";
import Fail from "../components/payment/Fail";
import Profile from "../components/profile/Profile";
import ChannelBook from "../components/channel/ChannelBook";
import ScheduleEdit from "../components/schedule/ScheduleEdit";
import Notification from "../components/profile/Notification";
import CreateStudyPage from "../pages/CreateStudyPage";
import SocialLoginCallback from "../components/auth/SocialLoginCallback";
import PasswordResetPage from "../pages/PasswordResetPage";
import PointListPage from "../pages/PointListPage";
import ApplicationListPage from "@/pages/ApplicationListPage";
import EmailCodeAuth from "@/components/auth/EmailCodeAuth";
import MailAuth from "@/components/auth/MailAuth";

const Router = (): JSX.Element => {
  return (
    <Routes>
      <Route path="*" element={<Error />} />
      <Route path="/" element={<Main />} />
      <Route path="/:type/:status/:category/:keywordValue/:order/:page" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/SignUp/mailAuth" element={<MailAuth />} />
      <Route path="/sendEmail_PasswordReset" element={<PasswordResetPage />} />
      <Route path="/resetPassword" element={<EmailCodeAuth />} />
      <Route path="/oauth2/callback" element={<SocialLoginCallback first={true} />} />
      <Route path="/socialCallback" element={<SocialLoginCallback first={false} />} />
      <Route path="/profile" element={<ProfilePage />}>
        <Route path="/profile/payment" element={<Profile />} />
        <Route path="/profile/myInfo" element={<Profile />} />
        <Route path="/profile/paymentList" element={<PaymentListPage />} />
        <Route path="/profile/pointList" element={<PointListPage />} />
        <Route path="/profile/notification" element={<Notification />} />
        <Route path="/profile/myApplication" element={<ApplicationListPage />} />
      </Route>
      <Route path="/payment" element={<ProfilePage />} />
      <Route path="/paymentSuccess/*" element={<Success />} />
      <Route path="/paymentFail/*" element={<Fail />} />
      <Route path="/channel/:channelId" element={<ChannelPage />}>
        <Route path="/channel/:channelId/:tab" element={<ChannelBook />} />
        <Route path="/channel/:channelId/schedule/:selectedDateParam" element={<ChannelBook />} />
        <Route path="/channel/:channelId/schedule/:selectedDateParam/schedule_edit" element={<ScheduleEdit />} />
        <Route path="/channel/:channelId/information/information_edit" element={<ChannelBook />} />
      </Route>
      <Route path="/createStudy" element={<CreateStudyPage />} />
    </Routes>
  );
};

export default Router;
