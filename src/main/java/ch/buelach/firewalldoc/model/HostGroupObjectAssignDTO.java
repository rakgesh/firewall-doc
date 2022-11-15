package ch.buelach.firewalldoc.model;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class HostGroupObjectAssignDTO {
    private String hgoId;
    private List<String> hoIds;
}
