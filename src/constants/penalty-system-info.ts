export const PENALTY_SYSTEM = `
스터디 채널에 모인 총 예치금은 출석률에 따라 차등 분배됩니다.
환급금 분배 방식은 아래와 같습니다.

예시1)
A : 출석률 50%
B : 출석률 70%
C : 출석률 90%

인당 1만원씩 걷었을 때 총 예치금 3만원
A - 총 예치금 (30,000) * (50/210)
B - 총 예치금 (30,000)* (70/210)
C - 총 예치금 (30,000)* (90/210)

A의 환불 금액 = 30,000 * 0.238 ≈ 7142원
B의 환불 금액 = 30,000 * 0.333 ≈ 9990원
C의 환불 금액 = 30,000 * 0.429 ≈ 12868원
`;
