package hk.edu20260825.day16;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class D2_StreamTest {
    public static void main(String[] args) {
        // List 객체 -> Stream객체 생성 -> 중간연산 -> 최종연산

        // asList() -> 값을 한꺼번에 정의할때 편리함(단, 길이는 고정됨)
        List<String> list = Arrays.asList("김태경", "김상원", "임종서");
        // 기존 list와 조금 다름: add(), remove()사용X -> 수정가능 set(), replace()는 사용가능

        Stream<String> streamList = list.stream();
        streamList.filter(s -> s.contains("김")).sorted()
                .forEach(s -> System.out.println(s));

        // Stream객체는 한번 사용하면 끝남 -> 다시 못씀
        // -> 데이터를 연결하는 파이프 개념이라 한번 소비하면 종료됨

        // 그래서 list를 계속 사용하는 경우라면 Stream객체를 바로 생성해서 사용

        list.stream().filter(s -> s.startsWith("임")).sorted()
                // .forEach(s -> System.out.println(s));
                .forEach(System.out::println);
        // 람다식이 단순히 기존 메서드에 값을 전달하기만 한다면 ::을 사용하면 편리 --> 메서드 참조 문법

        // Stream을 사용하지 않고 구현한다면?
        List<String> list2 = new ArrayList<>();
        for (String s : list) {
            if (s.contains("김")) {
                list2.add(s);
            }
        }
        Collections.sort(list2);
        for (String s : list2) {
            System.out.println(s);
        }

        // map(): 배열에 값을 편집해서 새로운 배열로 반환
        // 원본 데이터를 변경하지 않는다
        List<Integer> listNum = list.stream() // stream 객체 생성
                // .map(s -> s.length()) // 새로운 값으로 변환해서 반환
                .map(String::length)
                .collect(Collectors.toList()); // 반환한 값을 list에 담아서 반환
        // listNum.add(11);
        System.out.println(listNum.toString()); // [3,3,3]

        // List.of(): 불변객체(길이변경X), add(),set(),remove() 사용X
        List<String> list3 = List.of("A", "B", "C", "D");

        // 일반 스트림
        list3.stream().forEach(s -> {
            System.out.println(s + "-" + Thread.currentThread().getName());
        });

        System.out.println("\n========================\n");
        // 병렬 스트림(Multi-Threaded Processing) : 속도가 빠름
        list3.parallelStream().forEach(s -> {
            System.out.println(s + "-" + Thread.currentThread().getName());
        });
    }
}
