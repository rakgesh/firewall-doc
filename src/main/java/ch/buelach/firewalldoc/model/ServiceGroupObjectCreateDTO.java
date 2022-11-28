package ch.buelach.firewalldoc.model;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class ServiceGroupObjectCreateDTO {
    
    private String name;
    private List<String> port;
    private String description;
    
}
