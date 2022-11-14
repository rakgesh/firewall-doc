package ch.buelach.firewalldoc.model;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class HostGroupObjectAssignDTO {
    private String hgoId;
    private String[] hoIds;
}
