import { useSelectedDateStore, useSelectedMonthStore } from "../../store/schedule-store";
import Calendar from "../calendar/Calendar";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ScheduleCalcResponseType, ScheduleInfoType } from "../../types/schedule-type";
import { getScheduleInfo, scheduleCalculator } from "../../utils/schedule-function";
import AddScheduleBtn from "../calendar/AddScheduleBtn";

const Schedules = (): JSX.Element => {
  const { channelId } = useParams();
  const { selectedDate } = useSelectedDateStore();
  const { selectedMonth } = useSelectedMonthStore();
  const [marks, setMarks] = useState<string[]>([]);
  const [scheduleState, setScheduleState] = useState<ScheduleCalcResponseType>();
  const [scheduleInfo, setScheduleInfo] = useState<ScheduleInfoType | false>();
  const attendList = ["홍길동", "김철수", "김영희"];

  useEffect(() => {
    //month상태가 바뀔 때마다 scheduleCalculator()호출해 일정들 가져오기
    if (channelId) {
      const year = selectedMonth.split("-")[0];
      const month = selectedMonth.split("-")[1];
      scheduleCalculator({ channelId, year, month }).then((response) => {
        response.scheduleMarks.map((schedule) => {
          setMarks((marks) => [...marks, ...schedule.marks]);
        });
        setScheduleState(() => response);
      });
    }
  }, [channelId, selectedMonth]);

  useEffect(() => {
    if (scheduleState) {
      getScheduleInfo(selectedDate, scheduleState.scheduleList, scheduleState.scheduleMarks).then((response) => {
        if (response.result) {
          setScheduleInfo(() => response.scheduleInfo);
        } else setScheduleInfo(() => false);
      });
    }
  }, [selectedDate]);

  return (
    <>
      <h2 className="text-2xl font-bold text-[#1C4587] text-center mb-4">스터디 일정</h2>
      <div className="flex flex-col md:flex-row justify-center items-center">
        <Calendar marks={marks} />
        <div className="schedule w-96 h-[393px] border border-solid border-[#B4BDCB] rounded-[50px] mt-4 md:mt-0 md:ml-4">
          <div className="m-6 h-[345px] overflow-y-scroll custom-scroll">
            {/* 일정이 등록되어 있는 경우 렌더링 될 요소 */}
            {scheduleInfo ? (
              <>
                <div className="h-fit bg-[#dce1e77e] rounded-[30px]">
                  <div className="p-4 border-b border-solid border-[#B4BDCB]">{scheduleInfo.name}</div>
                  <div className="p-4">{scheduleInfo.content}</div>
                </div>
                {/* 시간 */}
                <div className="h-fit flex items-center border border-solid border-[#DCE1E7] rounded-[50px] p-2 my-2">
                  <div className="w-fit flex items-center text-[#1C4587] font-bold mx-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-alarm mr-1"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z" />
                      <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.04 8.04 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.04 8.04 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1" />
                    </svg>
                    시간
                  </div>
                  <div className="w-32 lg:w-48 text-[#89919D] overflow-x-hidden text-ellipsis whitespace-nowrap">
                    {`${scheduleInfo.time[0].split(":")[0]}:${scheduleInfo.time[0].split(":")[1]} ~ ${scheduleInfo.time[1].split(":")[0]}:${scheduleInfo.time[1].split(":")[1]}`}
                  </div>
                </div>
                {/* 오프라인 스터디일 경우 장소 추가 */}
                {scheduleInfo.placeAddress && (
                  <div className="h-fit flex items-center border border-solid border-[#DCE1E7] rounded-[50px] p-2 my-2">
                    <div className="w-fit flex items-center text-[#1C4587] font-bold mx-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-geo-alt"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                      </svg>
                      장소
                    </div>
                    <div className="w-48 md:w-32 lg:w-48 text-[#89919D] overflow-x-hidden text-ellipsis whitespace-nowrap">
                      {scheduleInfo.placeAddress}
                    </div>
                  </div>
                )}
                {/* 출석 체크 멤버 */}
                <>
                  <h3 className="text-2xl font-bold text-[#1C4587] text-center my-4">
                    {selectedDate.split("-")[1]}.{selectedDate.split("-")[2]} 출석 멤버
                  </h3>
                  <div className="text-center text-[#B4BDCB]">아직 출석체크를 하지 않았습니다.</div>
                  {/* 출석완료 후 렌더링 될 요소 */}
                  {/* <div className="h-28 flex flex-wrap">
                    {attendList.map((member) => (
                      <div key={member} className="member w-fit h-fit flex flex-col justify-center items-center mx-2">
                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                        <span>{member}</span>
                      </div>
                    ))}
                  </div> */}
                </>
              </>
            ) : (
              <div className="h-full flex flex-col justify-center items-center">
                <h3 className="text-2xl font-bold text-[#1C4587] text-center my-4">
                  {selectedDate.split("-")[1]}.{selectedDate.split("-")[2]}
                </h3>
                <div className="h-full flex justify-center items-center text-[#B4BDCB]">등록된 일정이 없습니다.</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 스터디 리더 용 일정등록/변경 버튼 */}
      <AddScheduleBtn />
    </>
  );
};

export default Schedules;