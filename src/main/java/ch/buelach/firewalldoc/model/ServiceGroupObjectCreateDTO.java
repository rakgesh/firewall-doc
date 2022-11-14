package ch.buelach.firewalldoc.model;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class ServiceGroupObjectCreateDTO {
    
    private String name;
    private String[] port;
    private String description;
    
}
