package hk.edu20260813.day09;

import java.time.LocalDate;
import java.util.Calendar;

public class D2_Calendar {

    // 윤년일때 달의 마지막 날
    private static final int[] leap = { 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };
    // 평년일때 달의 마지막 날
    private static final int[] plain = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };

    // 윤년을 판단하는 메서드
    public boolean isLeapYear(int year) {
        boolean isS = false;
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            isS = true;
        }
        return isS;
    }
    // 1년1월1일~2026년8월1일까지의 경과일 구하기-> 공백수를 구하기 위함
    // 1년은 365일, 366일 1년~2025년 -> 윤년만 판단해서 계속 합을 구해감
    // 해당 년도의 8월 전월까지 31+28+31 ....

    // 전년도까지의 경과일
    public int dates(int year) {
        int tot = 0;
        for (int i = 1; i < year; i++) {
            if (isLeapYear(i)) {
                tot += 366;
            } else {
                tot += 365;
            }
        }
        return tot;
    }

    // 전년도경과일+전월까지의 경과일
    public int dates(int year, int month) {
        int tot = dates(year);
        for (int i = 1; i < month; i++) {
            if (isLeapYear(year)) {
                tot += leap[i - 1];
            } else {
                tot += plain[i - 1];
            }
        }
        return tot;
    }

    // 전년도 경과일+전달까지 경과일+현재일 1일
    public int dates(int year, int month, int date) {
        return dates(year, month) + date;
    }

    // 해당 달의 마지막 날
    public int lastDay(int year, int month) {
        return isLeapYear(year) ? leap[month - 1] : plain[month - 1];
    }

    // 한달을 출력하는 메서드
    public void calendarPrint(int year, int month) {
        System.out.println(year + "년\t" + month + "월");
        System.out.println("일\t월\t화\t수\t목\t금\t토");

        // 1일의 요일 -> 0~6 -> 해당 달력의 앞쪽 공백수와 일치
        int dayOfWeek = dates(year, month, 1) % 7;

        // 공백을 출력
        for (int i = 0; i < dayOfWeek; i++) {
            System.out.print("\t");
        }
        // 날짜 출력
        for (int i = 1; i <= lastDay(year, month); i++) {
            System.out.print(i + "\t");
            if ((i + dayOfWeek) % 7 == 0) {
                System.out.println();
            }
        }
    }

    public static void main(String[] args) {
        D2_Calendar cal = new D2_Calendar();
        // cal.calendarPrint(2026, 8);

        // 실습: 1. 2026년도 1월~12까지 출력하기
        int year = 2026;
        for (int i = 1; i <= 12; i++) {
            cal.calendarPrint(year, i);
            System.out.println("\n");
        }
        // 실습: 2.나의 살아온 일수 구하기 --> 경과일 구하는 기능 구현
        int a = cal.dates(2026, 8, 13);
        int birth = cal.dates(1981, 5, 22);
        System.out.println("나의 살아온 일수:" + (a - birth));

        System.out.println("calendarAPI 사용한 경우");
        // 실습: 3. JAVA API를 활용해서 구현해보기
        // -- 관련 클래스: java.util.Calendar, java.time.LocalDate

        for (int i = 1; i <= 12; i++) {
            cal.calendarApiPrint(year, i);
        }

    }

    public void calendarApiPrint(int year, int month) {
        // Calendar -> new 객체생성 X --> 추상클래스(미완성된 메서드를 포함)
        // --> 사용하려면 반드시 하위에 자식클래스가 구현해야 된다.
        // --> 완성된 메서드, 미완성된 메서드 -> 완성된 메서드는 공통으로 사용하고 싶음

        // new X 못하고 getInstance() 메서드를 통해 객체를 얻어옴
        Calendar cal = Calendar.getInstance();
        // System.out.println(cal.get(Calendar.DATE));

        // 0월~11월로 계산함
        cal.set(year, month - 1, 1);// 특정날짜로 셋팅

        // 해당 달의 마지막날 구하기
        int lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
        int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);// 요일: 1~7 관리
        // 공백수 구한다면 dayOfWeek-1

        System.out.println(year + "년\t" + month + "월");
        System.out.println("일\t월\t화\t수\t목\t금\t토");
        // 공백 출력
        for (int i = 0; i < dayOfWeek - 1; i++) {
            System.out.print("\t");
        }
        for (int i = 1; i <= lastDay; i++) {
            System.out.print(i + "\t");
            if ((i + dayOfWeek - 1) % 7 == 0) {// 현재날짜가 토요일인지 확인
                System.out.println();
            }
        }
        System.out.println("\n");
    }

    // JDK 8 부터 등장: LocalDate
    public void localDateCalendarPrint(int year, int month) {
        // 선언 방법
        LocalDate today = LocalDate.now();// 현재날짜
        LocalDate dateStr = LocalDate.parse("2026-08-03");// 특정날짜를 문자열로 정의하는 경우

        // 1. 해당 연/월의 1일 날짜 객체 생성 (월에 -1 할 필요 없음!)
        LocalDate firstDay = LocalDate.of(year, month, 1);

        // 2. 그 달의 마지막 날짜 구하기 (윤년도 자동 계산됨)
        int lastDay = firstDay.lengthOfMonth();

        // 3. 1일의 요일 구하기
        // LocalDate의 getValue()는 [월:1, 화:2, ..., 토:6, 일:7]을 반환합니다.
        // % 7을 해주면 [일:0, 월:1, 화:2, ..., 토:6]으로 변환되어 바로 '공백수'가 됩니다!
        int dayOfWeek = firstDay.getDayOfWeek().getValue() % 7;

        // 출력부
        System.out.println(year + "년\t" + month + "월");
        System.out.println("일\t월\t화\t수\t목\t금\t토");

        // 1일 앞의 공백 출력
        for (int i = 0; i < dayOfWeek; i++) {
            System.out.print("\t");
        }

        // 날짜 출력 및 토요일 줄바꿈
        for (int i = 1; i <= lastDay; i++) {
            System.out.print(i + "\t");
            if ((i + dayOfWeek) % 7 == 0) {
                System.out.println();
            }
        }
        System.out.println("\n");
    }
}