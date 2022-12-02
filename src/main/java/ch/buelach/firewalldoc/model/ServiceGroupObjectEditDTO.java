package ch.buelach.firewalldoc.model;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ServiceGroupObjectEditDTO {

    private String id;
    private String name;
    private List<String> port;
    private String description;
    
}
