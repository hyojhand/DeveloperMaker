package com.ssafy.developermaker.domain.study.repository;

import com.ssafy.developermaker.domain.study.entity.Category;
import com.ssafy.developermaker.domain.study.entity.Study;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudyRepository extends JpaRepository<Study, Long> {
    List<Study> findByCategory(Category category);
    Page<Study> findByCategoryAndSubject(PageRequest pageRequest, Category category, String subject);
}
