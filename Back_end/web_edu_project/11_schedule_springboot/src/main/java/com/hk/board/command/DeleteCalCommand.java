package com.hk.board.command;

// ===== 일정 여러 개 삭제 요청을 받는 Command =====
// 목록 화면(calboardlist.html)의 체크박스 name="seq" 들이 이 객체의 seq 배열로 들어온다.
//   예) 체크 3개 → seq = {"12", "15", "20"}

// 참고: 아래 groovy.transform.ToString 은 Lombok 이 아니다(선생님 코드 그대로).
//       @ToString 줄이 주석이라 지금은 쓰이지 않고, toString 은 @Data 가 만들어 준다.
import groovy.transform.ToString;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// @Getter
// @Setter
// 기본 생성자 — 스프링이 요청 값을 담을 때 빈 객체를 먼저 만들기 때문에 필요
@NoArgsConstructor
@AllArgsConstructor
// @ToString
// @Data = @Getter + @Setter + @ToString + @EqualsAndHashCode + @RequiredArgsConstructor 를 한 번에
@Data
public class DeleteCalCommand {

    // @NotEmpty: 배열이 null 이거나 길이 0 이면 오류 → 아무것도 체크 안 하고 삭제를 누른 경우
    //   Controller 의 @Validated 가 검사하고, 오류 메시지는 화면의 th:errors="*{seq}" 자리에 나온다.
    @NotEmpty(message = "삭제하려면 최소 하나 이상 체크하세요")
    private String[] seq;

}
