package ch.buelach.firewalldoc.model;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class HostGroupObjectCreateDTO {

    private String name;
    private String description;
    private List<String> membersId;
    
}
