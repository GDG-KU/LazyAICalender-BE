import { calculateRuleDateListWithRRule } from '../utils/date.utils';
import { CreateRuleDto } from '../dto/create-schedule.dto';
import { RuleType } from '@prisma/client';

// 날짜 비교를 쉽게 하기 위한 헬퍼 함수 (UTC 기준 YYYY-MM-DD 반환)
const toDateString = (date: Date) => date.toISOString().split('T')[0];

describe('calculateRuleDateListWithRRule', () => {
  // 테스트 기준일: 2024년 1월 1일 (월요일) - 윤년
  const START_DATE = new Date('2024-01-01T00:00:00Z');

  /**
   * 1. DAILY 테스트
   * - 핵심: Term(Interval)만 신경 씀
   */
  describe('DAILY Rule', () => {
    it('should generate dates every day (term=1)', () => {
      const START_DATE_B = new Date('2024-01-01T10:00:00Z');
      const dto: CreateRuleDto = {
        startDatetime: START_DATE_B,
        ruleType: RuleType.DAILY,
        term: 1,
        periodEndDate: new Date('2024-01-05T10:00:00Z'), // 5일치만 생성
        // 불필요한 필드가 있어도 무시해야 함
        dayOfWeek: [1, 3],
      } as any;

      const result = calculateRuleDateListWithRRule(dto);
      console.log(result);
      const dates = result.map((v) => v.toISOString());

      console.log(dates);
      expect(dates).toEqual([
        '2024-01-01T10:00:00.000Z',
        '2024-01-02T10:00:00.000Z',
        '2024-01-03T10:00:00.000Z',
        '2024-01-04T10:00:00.000Z',
        '2024-01-05T10:00:00.000Z',
      ]);
    });

    it('should generate dates every 3 days (term=3)', () => {
      const dto: CreateRuleDto = {
        startDatetime: START_DATE,
        ruleType: RuleType.DAILY,
        term: 3,
        periodEndDate: new Date('2024-01-10T00:00:00Z'),
      } as any;

      const result = calculateRuleDateListWithRRule(dto);
      const dates = result.map((v) => v.toISOString());

      console.log(dates);
      expect(dates).toEqual([
        '2024-01-01T00:00:00.000Z',
        '2024-01-04T00:00:00.000Z',
        '2024-01-07T00:00:00.000Z',
        '2024-01-10T00:00:00.000Z',
      ]);
    });
  });

  /**
   * 2. WEEKLY 테스트
   * - 핵심: DayOfWeek(요일)과 Term(주 간격)
   */
  describe('WEEKLY Rule', () => {
    it('should generate dates on specific days (Mon, Wed) every week', () => {
      const dto: CreateRuleDto = {
        startDatetime: START_DATE, // 월요일
        ruleType: RuleType.WEEKLY,
        term: 1,
        dayOfWeek: [1, 3], // 1:Mon, 3:Wed (RRule: 0=Sun ~ 6=Sat 라고 가정 시, 보통 JS getDay()는 0=Sun, 1=Mon)
        // 주의: RRule 상수 매핑이 코드 내에 어떻게 되어있는지 확인 필요.
        // 여기서는 작성해주신 코드 기준: WEEKDAYS = [SU, MO, TU, WE, TH, FR, SA] 이므로 index 1=MO, 3=WE
        periodEndDate: new Date('2024-01-14T00:00:00Z'), // 2주치
      } as any;

      const result = calculateRuleDateListWithRRule(dto);
      const dates = result.map(toDateString);

      console.log(dates);
      expect(dates).toEqual([
        '2024-01-01', // 월
        '2024-01-03', // 수
        '2024-01-08', // 다음주 월
        '2024-01-10', // 다음주 수
      ]);
    });

    it('should apply term (every 2 weeks)', () => {
      const dto: CreateRuleDto = {
        startDatetime: START_DATE,
        ruleType: RuleType.WEEKLY,
        term: 2, // 격주
        dayOfWeek: [1], // 월요일만
        periodEndDate: new Date('2024-01-29T00:00:00Z'),
      } as any;

      const result = calculateRuleDateListWithRRule(dto);
      const dates = result.map(toDateString);

      expect(dates).toEqual([
        '2024-01-01', // 첫째주 월
        '2024-01-15', // 셋째주 월 (2주 건너뜀)
        '2024-01-29', // 다섯째주 월
      ]);
    });
  });

  /**
   * 3. MONTHLY 테스트
   * - 핵심: WeekOfMonth(주차) + Term
   * - 로직: WeekOfMonth와 DayOfWeek를 조합하여 "N번째 주 M요일"을 계산
   */
  describe('MONTHLY Rule', () => {
    it('should generate dates for 2nd Tuesday of every month', () => {
      // 2024년 1월 1일은 월요일
      // 1월의 2번째 화요일 -> 1/9
      // 2월의 2번째 화요일 -> 2/13
      const dto: CreateRuleDto = {
        startDatetime: START_DATE,
        ruleType: RuleType.MONTHLY,
        term: 1,
        weekOfMonth: [2], // 2주차
        dayOfWeek: [2], // 화요일 (index 2 = TU)
        periodEndDate: new Date('2024-03-01T00:00:00Z'),
      } as any;

      const result = calculateRuleDateListWithRRule(dto);
      const dates = result.map(toDateString);

      console.log(dates);
      expect(dates).toEqual(['2024-01-09', '2024-02-13']);
    });

    it('should handle multiple weeks and days (1st and 3rd Monday)', () => {
      const dto: CreateRuleDto = {
        startDatetime: START_DATE,
        ruleType: RuleType.MONTHLY,
        term: 1,
        weekOfMonth: [1, 3], // 1주차, 3주차
        dayOfWeek: [1], // 월요일
        periodEndDate: new Date('2024-02-01T00:00:00Z'), // 1월만 확인
      } as any;

      const result = calculateRuleDateListWithRRule(dto);
      const dates = result.map(toDateString);

      console.log(dates);
      expect(dates).toEqual([
        '2024-01-01', // 1주차 월요일
        '2024-01-15', // 3주차 월요일
      ]);
    });
  });

  /**
   * 4. YEARLY 테스트
   * - 핵심: MonthOfYear(월) + Term
   */
  describe('YEARLY Rule', () => {
    it('should generate dates in specific months (Mar, Dec)', () => {
      const dto: CreateRuleDto = {
        startDatetime: START_DATE,
        ruleType: RuleType.YEARLY,
        term: 1,
        monthOfYear: [3, 12], // 3월, 12월
        periodEndDate: new Date('2024-12-31T00:00:00Z'),
      } as any;

      const result = calculateRuleDateListWithRRule(dto);
      const dates = result.map(toDateString);

      console.log(dates);
      // Yearly는 기본적으로 start date의 '일(Day)'을 따라감 (1일)
      expect(dates).toEqual(['2024-03-01', '2024-12-01']);
    });

    it('should apply term (every 2 years)', () => {
      const dto: CreateRuleDto = {
        startDatetime: START_DATE,
        ruleType: RuleType.YEARLY,
        term: 2, // 2년마다
        monthOfYear: [5], // 5월
        periodEndDate: new Date('2026-12-31T00:00:00Z'), // 3년치 범위
      } as any;

      const result = calculateRuleDateListWithRRule(dto);
      const dates = result.map(toDateString);

      console.log(dates);
      expect(dates).toEqual([
        '2024-05-01', // 첫 해 5월
        '2026-05-01', // 2년 뒤 5월
      ]);
    });
  });
});
