import { useState } from "react";
import Pagination from "../common/Pagination";
import Card from "./Card";

const StudyList = (): JSX.Element => {
  const [curPage, setCurPage] = useState(1);

  return (
    <div className="study-list w-full px-8 my-20 mt-40 flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold text-Blue-2 mb-10">스터디 채널</h2>
      <div className="w-full flex flex-col lg:flex-row justify-between items-center mb-20">
        <div className="flex flex-col justify-center items-center">
          <span className="text-Gray-4">방식</span>
          <div className="flex items-center mt-2">
            <button id="offlineFilter" className="btn-blue rounded-r-none text-xs md:text-sm break-keep ml-2">
              오프라인
            </button>
            <button id="onlineFilter" className="btn-blue rounded-l-none text-xs md:text-sm break-keep ml-1">
              온라인
            </button>
          </div>
          {/* 아래 오프라인 클릭 시 지역 선택 드롭다운 렌더링할 코드 */}
          <div></div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <span className="text-Gray-4">상태</span>
          <div className="flex items-center mt-2">
            <button id="recruitingFilter" className="btn-blue rounded-r-none text-xs md:text-sm break-keep ml-2">
              모집중
            </button>
            <button id="recruitedFilter" className="btn-blue rounded-l-none text-xs md:text-sm break-keep ml-1">
              모집완료
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-4 md:mt-0">
          <span className="text-Gray-4">카테고리</span>
          <div className="flex flex-wrap sm:flex-nowrap justify-center items-center mt-2">
            <button id="computerCategory" className="btn-blue sm:rounded-r-none text-xs md:text-sm break-keep ml-2">
              컴퓨터/IT/개발
            </button>
            <button id="languageCategory" className="btn-blue sm:rounded-none text-xs md:text-sm break-keep ml-1">
              언어/어학
            </button>
            <button id="employmentCategory" className="btn-blue sm:rounded-none text-xs md:text-sm break-keep ml-1">
              취업/이직
            </button>
            <button
              id="selfDevelopCategory"
              className="btn-blue sm:rounded-l-none text-xs md:text-sm break-keep ml-1 mt-2 sm:mt-0"
            >
              자기계발
            </button>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end cursor-pointer px-8 mb-4 relative">
        <div className="bg-white border border-solid border-Gray-2 px-2 py-1 rounded-[10px] flex items-center">
          {/* 최신순/조회순 두 가지 정렬 */}
          최신순
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-caret-down-fill text-Gray-2 ml-2"
            viewBox="0 0 16 16"
          >
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
          </svg>
        </div>
        {/* 클릭하면 뜨게 할 선택드롭다운 */}
        <div className="absolute top-8 w-[84px] bg-white border border-solid border-Gray-2 rounded-[10px] flex flex-col">
          <div className="w-full px-2 py-1 border-b border-solid border-Gray-2 rounded-t-[10px] text-center hover:bg-Gray-1">
            최신순
          </div>
          <div className="w-full px-2 py-1 text-center rounded-b-[10px] hover:bg-Gray-1">조회순</div>
        </div>
      </div>
      <div className="study-cards-container w-full flex justify-center items-center flex-wrap">
        {/* 받은 채널 리스트의 길이만큼 map을 이용해 Card 생성 */}
        {/* api: GET /api/study-channels?pageNumber=2&order=RECENT&type=ONLINE&category=IT */}
        <Card studyInfo={""} />
        <Card studyInfo={""} />
        <Card studyInfo={""} />
        <Card studyInfo={""} />
        <Card studyInfo={""} />
        <Card studyInfo={""} />
      </div>
      {/* 페이지네이션 컴포넌트 - dataListLength는 임시값입니다 */}
      <Pagination curPage={curPage} setCurPage={setCurPage} dataListLength={43} />
    </div>
  );
};

export default StudyList;
