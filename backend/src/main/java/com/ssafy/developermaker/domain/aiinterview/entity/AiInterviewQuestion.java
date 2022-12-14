package com.ssafy.developermaker.domain.aiinterview.entity;

import com.ssafy.developermaker.domain.aiinterview.dto.AiInterviewQuestionDto;
import org.springframework.beans.factory.annotation.Value;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

@Entity
public class AiInterviewQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long aiqId;

    @Column(nullable = false)
    private Integer no;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String question;

    @Column(nullable = false)
    private Integer demendCnt;
    @Column(nullable = false)
    private String keyword;

    private String keywordDetect;

    public AiInterviewQuestionDto toDto(){
        AiInterviewQuestionDto aiqDto = AiInterviewQuestionDto.builder().no(no).question(question).demendCnt(demendCnt).aiqId(aiqId).subject(subject).build();
        StringTokenizer st = new StringTokenizer(this.keyword, "/");
        List<String> list = new ArrayList<>();
        int size = st.countTokens();
        for(int i = 0; i < size; i++){
            list.add(st.nextToken());
        }
        aiqDto.setKeyword(list);

        st = new StringTokenizer(this.keywordDetect, "/");
        List<String> list2 = new ArrayList<>();
        size = st.countTokens();
        for(int i = 0; i < size; i++){
            list2.add(st.nextToken());
        }
        aiqDto.setKeywordDetect(list2);
        return aiqDto;

    }
}
