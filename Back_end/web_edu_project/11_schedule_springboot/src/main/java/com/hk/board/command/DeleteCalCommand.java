package com.hk.board.command;

import groovy.transform.ToString;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// @Getter
// @Setter
@NoArgsConstructor
@AllArgsConstructor
// @ToString
@Data

public class DeleteCalCommand {

    @NotEmpty(message = "삭제하려면 최소 하나 이상 체크하세요")
    private String[] seq;
}
