package ch.buelach.firewalldoc.model;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class FirewallRuleCreateDTO {

    private String fwTypeId;
    private String contextId;
    private String sourceId;
    private String destinationId;
    private String securityGroupObjectId;
    private String useCaseId;

}
