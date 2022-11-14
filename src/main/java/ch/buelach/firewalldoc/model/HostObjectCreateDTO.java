package ch.buelach.firewalldoc.model;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class HostObjectCreateDTO {

    private String name;
    private String ip;
    private String description;

}
