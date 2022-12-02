package ch.buelach.firewalldoc.model;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FirewallRuleEditDTO {

    private String id;
    private String fwTypeId;
    private String contextId;
    private String sourceId;
    private String destinationId;
    private String serviceGroupObjectId;
    private String useCaseId;
    
}
