package com.fit.challenge.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "common_codes")
@Getter @Setter
@NoArgsConstructor
public class CommonCode {

    @Id
    @Column(name = "code_id", length = 10)
    private String codeId; // 예: 'L01', 'C_ST', 'T_LEG'

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_code")
    private CommonGroup group;

    @Column(name = "code_nm", length = 50, nullable = false)
    private String codeName; // 예: '초급', '근력', '하체'

    @Column(name = "sort_order")
    private Integer sortOrder = 0;
}





