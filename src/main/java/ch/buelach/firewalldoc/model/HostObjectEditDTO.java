package ch.buelach.firewalldoc.model;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class HostObjectEditDTO {

    private String id;
    private String name;
    private String ip;
    private String description;
}
