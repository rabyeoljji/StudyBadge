import NONE_BADGE from "../../assets/NONE-BADGE_PNG.png";
import BRONZE_BADGE from "../../assets/BRONZE-BADGE_PNG.png";
import SILVER_BADGE from "../../assets/SILVER-BADGE_PNG.png";
import GOLD_BADGE from "../../assets/GOLD-BADGE_PNG.png";
import { useQuery } from "@tanstack/react-query";
import { MemberListPropsType, MemberListResponseType } from "../../types/study-channel-type";
import { getMemberList, postBanish, postSubLeader } from "../../services/channel-api";
import { useParams } from "react-router";
import { useState } from "react";
import Modal from "../common/Modal";
import { AxiosError } from "axios";
import { useAuthStore } from "@/store/auth-store";
import PersonIcon from "../common/PersonIcon";
import MemberSkeleton from "../skeleton/MemberSkeleton";
import { SKELETON_LIST } from "@/constants/skeleton-list";

const banishContent = `해당 멤버를 스터디에서 퇴출시키겠습니까?\n(퇴출 시 총 예치금에서 퇴출 멤버가 지불한 예치금을 전액 제외합니다.)`;

const MemberList = ({ setNewSubLeader, setModal, isStudyEnd }: MemberListPropsType): JSX.Element => {
  const { accessToken, isMember } = useAuthStore();
  const { channelId } = useParams();
  const [studyMemberState, setStudyMemberState] = useState<{ name: string; id: undefined | number }>({
    name: "",
    id: undefined,
  });
  const { data, error, isLoading } = useQuery<MemberListResponseType, AxiosError>({
    queryKey: ["memberList", channelId],
    queryFn: () => getMemberList(Number(channelId)),
    enabled: !!accessToken && !!isMember && !!channelId, // accessToken과 isMember===true 경우에만 쿼리 실행
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "",
    content: "",
  });

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    studyMemberId: number,
    memberName?: string,
  ) => {
    if (studyMemberId) {
      if (memberName) {
        setStudyMemberState(() => ({ name: memberName, id: studyMemberId }));
      } else {
        setStudyMemberState((origin) => ({ ...origin, id: studyMemberId }));
      }
    }

    const target = e.target as HTMLButtonElement;
    if (target.id === "subLeaderBtn") {
      setModalState(() => ({
        isOpen: true,
        type: "SUB_LEADER",
        content: "해당 멤버를 서브리더로 임명하시겠습니까?",
      }));
    }
    if (target.id === "banishBtn") {
      setModalState(() => ({
        isOpen: true,
        type: "BANISH",
        content: banishContent,
      }));
    }
  };

  const handleConfirm = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    studyMemberId: number,
    memberName: string,
  ) => {
    const target = e.target as HTMLButtonElement;
    if (modalState.type === "SUB_LEADER") {
      if (target.classList.contains("yes-btn")) {
        if (setNewSubLeader && setModal) {
          setNewSubLeader(() => ({ name: memberName, id: studyMemberId }));
          setModalState((origin) => ({
            ...origin,
            isOpen: false,
          }));
          setModal(() => false);
          return;
        }
        await postSubLeader(Number(channelId), { studyMemberId: studyMemberId });
      }
    }
    if (modalState.type === "BANISH") {
      if (target.classList.contains("yes-btn")) {
        await postBanish(Number(channelId), studyMemberId);
      }
    }
    setModalState((origin) => ({ ...origin, isOpen: false }));
    window.location.reload();
  };

  if (!isMember) {
    // 멤버가 아닐 때
    return (
      <>
        <h2 className="text-2xl font-bold text-Blue-2 text-center mb-2">스터디 멤버</h2>
        <div className="w-full h-[500px] flex flex-wrap justify-center items-center px-10 sm:px-12 py-4 overflow-y-scroll custom-scroll">
          <div className="w-full h-full"></div>
        </div>
      </>
    );
  } else {
    // 리더일 때
    if (!isStudyEnd && data && data.leader) {
      return (
        <>
          <h2 className="text-2xl font-bold text-Blue-2 text-center mb-2">스터디 멤버</h2>
          <div className="w-full h-[500px] flex flex-wrap justify-center items-center px-10 sm:px-12 py-4 overflow-y-scroll custom-scroll">
            <>
              {error &&
                (error.response?.status === 401 ? (
                  <div>회원에게만 공개되는 컨텐츠입니다.</div>
                ) : (
                  <div className="text-center">
                    멤버를 불러오는 데 실패하였습니다. errorName: {error.name} , errorMessage: {error.message}
                  </div>
                ))}
              {isLoading
                ? SKELETON_LIST.map((value) => <MemberSkeleton key={`skeleton_${value}`} />)
                : !isLoading &&
                  Array.isArray(data.studyMembers) &&
                  data.studyMembers.map((member) => (
                    <div
                      key={member.studyMemberId}
                      className={`w-[210px] h-80 border border-solid border-Gray-3 rounded-[50px] flex flex-col ${!isStudyEnd && data.leader ? "justify-between" : "justify-center"} items-center px-4 py-8 m-2 relative`}
                    >
                      {member.badgeLevel === "NONE" && (
                        <img src={NONE_BADGE} alt="기본뱃지" className="absolute w-16 right-8" />
                      )}
                      {member.badgeLevel === "BRONZE" && (
                        <img src={BRONZE_BADGE} alt="브론즈뱃지" className="absolute w-16 right-8" />
                      )}
                      {member.badgeLevel === "SILVER" && (
                        <img src={SILVER_BADGE} alt="실버뱃지" className="absolute w-16 right-8" />
                      )}
                      {member.badgeLevel === "GOLD" && (
                        <img src={GOLD_BADGE} alt="골드뱃지" className="absolute w-16 right-8" />
                      )}
                      <div className="flex flex-col justify-center items-center">
                        {member.imageUrl ? (
                          <img
                            src={member.imageUrl}
                            alt="프로필 이미지"
                            className="object-cover w-28 h-28 rounded-full bg-Gray-1"
                          />
                        ) : (
                          <div className="w-28 h-28 rounded-full bg-Gray-3 flex justify-center items-center">
                            <PersonIcon color="text-white" size={[60, 60]} />
                          </div>
                        )}
                        <p
                          className={`${!isStudyEnd && data.leader ? "text-xl" : "text-2xl mt-10"} font-bold text-Blue-2`}
                        >
                          {member.name}
                        </p>
                        {member.role === "LEADER" && <p className="font-bold text-Red-2 mt-4">리더</p>}
                        {member.role === "SUB_LEADER" && <p className="font-bold text-Red-2 mt-4">서브리더</p>}
                      </div>
                      {/* 리더에게만 보여질 버튼 */}
                      <button
                        type="button"
                        id="subLeaderBtn"
                        className={`${(member.role === "LEADER" || member.role === "SUB_LEADER") && "hidden"} btn-blue px-3 py-2 w-28`}
                        onClick={(e) => handleClick(e, member.studyMemberId, member.name)}
                      >
                        서브리더로 지정
                      </button>
                      <button
                        type="button"
                        id="banishBtn"
                        className={`${member.role === "LEADER" && "hidden"} btn-red px-3 py-2 w-28`}
                        onClick={(e) => handleClick(e, member.studyMemberId)}
                      >
                        퇴출
                      </button>
                      {modalState.isOpen && studyMemberState && (
                        <Modal>
                          <div className="w-60 px-6 flex flex-col justify-center items-center text-center whitespace-pre-wrap">
                            {modalState.content}
                            <div className="flex justify-center items-center mt-10">
                              <button
                                type="button"
                                className="yes-btn btn-blue w-10 mr-4"
                                onClick={(e) =>
                                  handleConfirm(e, studyMemberState.id ?? member.studyMemberId, studyMemberState.name)
                                }
                              >
                                예
                              </button>
                              <button
                                type="button"
                                className="no-btn btn-blue"
                                onClick={() => setModalState((origin) => ({ ...origin, isOpen: false }))}
                              >
                                아니요
                              </button>
                            </div>
                          </div>
                        </Modal>
                      )}
                    </div>
                  ))}
            </>
          </div>
        </>
      );
    } else if (!isStudyEnd && data) {
      // 리더가 아닐 때
      return (
        <>
          <h2 className="text-2xl font-bold text-Blue-2 text-center mb-2">스터디 멤버</h2>
          <div className="w-full h-[500px] flex flex-wrap justify-center items-center px-10 sm:px-12 py-4 overflow-y-scroll custom-scroll">
            <>
              {error &&
                (error.response?.status === 401 ? (
                  <div>회원에게만 공개되는 컨텐츠입니다.</div>
                ) : (
                  <div className="text-center">
                    멤버를 불러오는 데 실패하였습니다. errorName: {error.name} , errorMessage: {error.message}
                  </div>
                ))}
              {isLoading
                ? SKELETON_LIST.map((value) => <MemberSkeleton key={`skeleton_${value}`} />)
                : !isLoading &&
                  Array.isArray(data.studyMembers) &&
                  data.studyMembers.map((member) => (
                    <div
                      key={member.memberId}
                      className={`w-[210px] h-80 border border-solid border-Gray-3 rounded-[50px] flex flex-col ${!isStudyEnd && data.leader ? "justify-between" : "justify-center"} items-center px-4 py-8 m-2 relative`}
                    >
                      {member.badgeLevel === "NONE" && (
                        <img src={NONE_BADGE} alt="기본뱃지" className="absolute w-16 right-8" />
                      )}
                      {member.badgeLevel === "BRONZE" && (
                        <img src={BRONZE_BADGE} alt="브론즈뱃지" className="absolute w-16 right-8" />
                      )}
                      {member.badgeLevel === "SILVER" && (
                        <img src={SILVER_BADGE} alt="실버뱃지" className="absolute w-16 right-8" />
                      )}
                      {member.badgeLevel === "GOLD" && (
                        <img src={GOLD_BADGE} alt="골드뱃지" className="absolute w-16 right-8" />
                      )}
                      <div className="flex flex-col justify-center items-center">
                        {member.imageUrl ? (
                          <img
                            src={member.imageUrl}
                            alt="프로필 이미지"
                            className="object-cover w-28 h-28 rounded-full bg-Gray-1"
                          />
                        ) : (
                          <div className="w-28 h-28 rounded-full bg-Gray-3 flex justify-center items-center">
                            <PersonIcon color="text-white" size={[60, 60]} />
                          </div>
                        )}
                        <p
                          className={`${!isStudyEnd && data.leader ? "text-xl" : "text-2xl mt-10"} font-bold text-Blue-2`}
                        >
                          {member.name}
                        </p>
                        {member.role === "LEADER" && <p className="font-bold text-Red-2 mt-4">리더</p>}
                        {member.role === "SUB_LEADER" && <p className="font-bold text-Red-2 mt-4">서브리더</p>}
                      </div>
                    </div>
                  ))}
            </>
          </div>
        </>
      );
    }
  }
  return <></>;
};

export default MemberList;
