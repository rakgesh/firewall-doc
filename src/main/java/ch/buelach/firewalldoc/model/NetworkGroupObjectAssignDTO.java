package ch.buelach.firewalldoc.model;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class NetworkGroupObjectAssignDTO {

    private String ngoId;
    private List<String> noIds;
    
}
