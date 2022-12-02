package ch.buelach.firewalldoc.model;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class NetworkGroupObjectEditDTO {

    private String id;
    private String name;
    private String description;
    private List<String> membersId;
    
}
