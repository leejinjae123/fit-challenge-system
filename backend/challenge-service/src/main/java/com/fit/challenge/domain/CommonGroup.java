package com.fit.challenge.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "common_groups")
@Getter @Setter
@NoArgsConstructor
public class CommonGroup {

    @Id
    @Column(name = "group_code", length = 10)
    private String groupCode; // 예: 'LVL', 'CAT', 'TGT'

    @Column(name = "group_name", length = 50, nullable = false)
    private String groupName; // 예: '숙련도', '운동유형', '타겟부위'
}





