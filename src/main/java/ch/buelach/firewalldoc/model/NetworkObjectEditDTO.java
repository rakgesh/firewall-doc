package ch.buelach.firewalldoc.model;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class NetworkObjectEditDTO {
    private String id;
    private String name;
    private String ip;
    private String subnet;
    private String description;
}
