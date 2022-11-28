package ch.buelach.firewalldoc.model;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class ContextCreateDTO {
    private String name;
    private String ip;
    private String subnet;
    private String description;
    
}
