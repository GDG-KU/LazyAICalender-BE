import { RRule, Weekday } from 'rrule';
import { CreateRuleDto } from '../dto/create-schedule.dto';
import { RuleType } from '@prisma/client';

export function calculateRuleDateListWithRRule(
  dto: CreateRuleDto,
  yearRange: number = 1,
): Date[] {
  // 1. 시작일 및 종료일(Until) 설정
  const start = new Date(dto.startDatetime);

  // 종료일 계산 (dto.periodEndDate가 없으면 yearRange 뒤까지)
  const until = (() => {
    if (dto.periodEndDate) {
      const u = new Date(dto.periodEndDate);
      return u;
    }
    const yearLater = new Date(start);
    yearLater.setFullYear(yearLater.getFullYear() + yearRange);
    yearLater.setDate(yearLater.getDate() - 1);
    return yearLater;
  })();

  // RRule용 요일 상수 배열 (0: SUN ~ 6: SAT)
  const WEEKDAYS = [
    RRule.SU,
    RRule.MO,
    RRule.TU,
    RRule.WE,
    RRule.TH,
    RRule.FR,
    RRule.SA,
  ];

  // 2. 기본 옵션 설정 (Term 적용)
  const opts: any = {
    dtstart: start,
    until,
    interval: Math.max(1, dto.term ?? 1), // Term(간격) 적용
  };

  // 3. RuleType별 로직 분기 (요청하신 조건에 맞춰 단순화)
  switch (dto.ruleType) {
    case RuleType.DAILY:
      opts.freq = RRule.DAILY;
      // Daily는 Term 외에 추가 조건 없음
      break;

    case RuleType.WEEKLY:
      opts.freq = RRule.WEEKLY;
      // DayOfWeek 처리
      if (dto.dayOfWeek && dto.dayOfWeek.length > 0) {
        opts.byweekday = dto.dayOfWeek
          .map((d) => WEEKDAYS[d])
          .filter(Boolean);
      }
      break;

    case RuleType.MONTHLY:
      opts.freq = RRule.MONTHLY;
      // WeekOfMonth 처리 (N번째 주 M요일)
      // 로직: 입력된 요일들(dayOfWeek) 각각에 대해 입력된 주차(weekOfMonth)를 적용
      // 예: weekOfMonth=[1, 3], dayOfWeek=[1(월)] => 1주차 월요일, 3주차 월요일
      if (dto.weekOfMonth && dto.weekOfMonth.length > 0) {
        const byWeekdayWithNth: Weekday[] = [];

        // 요일 지정이 없으면 시작일의 요일을 기준으로 함
        const targetDays =
          dto.dayOfWeek && dto.dayOfWeek.length > 0
            ? dto.dayOfWeek
          : [start.getDay()];

        for (const week of dto.weekOfMonth) {
          const nth = Math.trunc(week); // 1, 2, 3, 4, 5(마지막)
          for (const dayIdx of targetDays) {
            // RRule의 nth 기능을 사용하여 'N번째 요일' 생성
            byWeekdayWithNth.push(WEEKDAYS[dayIdx].nth(nth));
          }
        }
        opts.byweekday = byWeekdayWithNth;
      }
      break;

    case RuleType.YEARLY:
      opts.freq = RRule.YEARLY;
      // MonthOfYear 처리 (몇 월인지)
      if (dto.monthOfYear && dto.monthOfYear.length > 0) {
        opts.bymonth = dto.monthOfYear.map((m) => Math.round(m));
      }
      break;

    default:
      throw new Error('Unsupported ruleType');
  }

  // 4. 날짜 생성 및 정렬
  const rule = new RRule(opts);
  const dates = rule.between(start, until, true); // true: start 날짜 포함 여부

  // 시간순 정렬
  return dates.sort((a, b) => a.getTime() - b.getTime());
}
