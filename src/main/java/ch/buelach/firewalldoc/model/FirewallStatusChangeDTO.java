package ch.buelach.firewalldoc.model;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FirewallStatusChangeDTO {

    private String fwId;
    private String status;
    
}
