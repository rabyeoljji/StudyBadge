import NONE_BADGE from "../../assets/NONE-BADGE_PNG.png";
import BRONZE_BADGE from "../../assets/BRONZE-BADGE_PNG.png";
import SILVER_BADGE from "../../assets/SILVER-BADGE_PNG.png";
import GOLD_BADGE from "../../assets/GOLD-BADGE_PNG.png";
import ProfileEdit from "./ProfileEdit";
import { useEffect, useState } from "react";
import SelectAmount from "../payment/SelectAmount";
import Checkout from "../payment/Checkout";
import { useLocation, useNavigate } from "react-router";
import { MyStudyType } from "../../types/profile-type";
import { useEditModeStore } from "../../store/edit-mode-store";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMyStudy, useUserInfo } from "@/hooks/useQuery";
import { useAuthStore } from "@/store/auth-store";
import PageScrollTop from "../common/PageScrollTop";
import PersonIcon from "../common/PersonIcon";

const Profile = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [chargeAmount, setChargeAmount] = useState(10000);
  const [myStudy, setMyStudy] = useState<MyStudyType[]>([]);
  const { isEditMode, setIsEditMode } = useEditModeStore();
  const { accessToken } = useAuthStore();
  const { data, isLoading, error } = useUserInfo(accessToken);
  const myStudyData = useMyStudy(accessToken);

  useEffect(() => {
    return () => setIsEditMode(false); // 클린업 함수로 변경
  }, []);

  useEffect(() => {
    if (data) {
      try {
        if (myStudyData && myStudyData.data) {
          setMyStudy(() => myStudyData.data ?? []);
        }
      } catch (error) {
        console.log("내 스터디 리스트 로딩에 실패하였습니다." + error);
      }
    }
  }, [data, myStudyData]);

  useEffect(() => {
    const element = document.getElementById("root");
    if (element) {
      element.scrollIntoView();
    }

    if (location.state) {
      if (location.state.social) {
        setIsEditMode(true);
      }
    }
  }, [location]);

  return (
    <>
      <PageScrollTop />
      {isLoading && (
        <>
          <div className="w-full min-h-52 border border-solid border-Gray-3 rounded-t-[30px] p-6 flex flex-col items-center md:flex-row">
            <div className="flex items-center">
              <div className="no-profile-image w-32 h-32 bg-Gray-2 rounded-full flex justify-center items-center mr-8 animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="80"
                  fill="white"
                  className="bi bi-person"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                </svg>
              </div>
              <div className="w-32 h-12 rounded-[30px] bg-Gray-1 animate-pulse"></div>
            </div>
          </div>
          <div className="w-full h-fit bg-Gray-1 border-x border-b border-solid border-Gray-3 rounded-b-[30px] flex flex-col md:flex-row justify-between items-center px-10 py-8 md:py-4"></div>
        </>
      )}
      {!isLoading && data && isEditMode ? (
        <ProfileEdit userInfo={data} />
      ) : (
        data && (
          <>
            <div className="w-full min-h-52 border border-solid border-Gray-3 rounded-t-[30px] p-6 flex flex-col items-center md:flex-row">
              <div className="profile-image w-full md:w-2/3 flex flex-col justify-center md:border-r border-solid border-Gray-2">
                <div className="flex items-center">
                  {data.imgUrl ? (
                    <img src={data.imgUrl} alt="프로필 이미지" className="object-cover w-32 h-32 rounded-full mr-8" />
                  ) : (
                    <div className="no-profile-image w-32 h-32 bg-Gray-2 rounded-full flex justify-center items-center mr-8">
                      <PersonIcon color="text-white" size={[80, 80]} />
                    </div>
                  )}
                  <span className="text-2xl">{data.nickname}</span>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="btn-blue px-3 py-2 text-xs md:mr-8"
                    onClick={() => setIsEditMode(true)}
                  >
                    수정하기
                  </button>
                </div>
              </div>
              <div className="badge w-1/3 flex justify-center items-center mt-8 md:mt-0">
                {data.badgeLevel === "NONE" && <img src={NONE_BADGE} alt="기본뱃지" className="w-28" />}
                {data.badgeLevel === "BRONZE" && <img src={BRONZE_BADGE} alt="브론즈뱃지" className="w-28" />}
                {data.badgeLevel === "SILVER" && <img src={SILVER_BADGE} alt="실버뱃지" className="w-28" />}
                {data.badgeLevel === "GOLD" && <img src={GOLD_BADGE} alt="골드뱃지" className="w-28" />}
              </div>
            </div>
            <div className="w-full h-fit bg-Gray-1 border-x border-b border-solid border-Gray-3 rounded-b-[30px] flex flex-col md:flex-row justify-between items-center px-10 py-8 md:py-4">
              <div className="text-xl">
                충전금액 : <span className="ml-4 font-bold">{data.point && data.point.toLocaleString()}원</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigate("/profile/payment");
                }}
                className="btn-blue mt-8 md:mt-0"
              >
                충전하기
              </button>
            </div>
            {location.pathname === "/profile/payment" && !confirm && (
              <SelectAmount setConfirm={setConfirm} chargeAmount={chargeAmount} setChargeAmount={setChargeAmount} />
            )}
            {location.pathname === "/profile/payment" && confirm && (
              <Checkout setConfirm={setConfirm} chargeAmount={chargeAmount} />
            )}
            {/* 이용자가 소속된 스터디 채널 개수대로 렌더링 */}
            {!myStudy ? (
              <div className="border border-solid border-Gray-3 w-full h-32 p-10 rounded-[30px] flex flex-col justify-between items-center mt-10">
                <p>loading...</p>
              </div>
            ) : (
              Array.isArray(myStudy) &&
              myStudy.map((studyChannel) => (
                <Link
                  to={`/channel/${studyChannel.studyId}/information`}
                  key={studyChannel.studyId}
                  className="border border-solid border-Gray-3 w-full h-fit p-10 rounded-[30px] flex flex-col justify-center items-center mt-10 flex-wrap"
                >
                  <div className="flex flex-col-reverse sm:flex-row items-center mb-2 sm:mb-0">
                    <h3 className="font-bold text-xl md:text-2xl text-Blue-2">{studyChannel.studyName}</h3>
                    {studyChannel.role === "LEADER" && <span className="sm:ml-8 font-bold text-Red-2">리더</span>}
                  </div>
                  <div className="w-full md:w-[70%] flex justify-center items-center flex-wrap">
                    <span className="inline-block w-fit text-Blue-2 text-sm md:text-base mr-4">출석률</span>
                    <div className="w-[75%] h-4 bg-Gray-1 relative z-10">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: studyChannel.attendanceRatio * 0.01 }}
                        transition={{ duration: 0.5, originX: 0, originY: 1 }}
                        style={{ transformOrigin: "0% 100%" }}
                        className={`w-full h-4 bg-Blue-2 absolute top-0 left-0 z-20`}
                      ></motion.div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </>
        )
      )}
      {error && (
        <div>
          프로필을 로딩하는데 실패했습니다. errorName: {error.name}. errorMessage: {error.message}
        </div>
      )}
    </>
  );
};

export default Profile;
