package ch.buelach.firewalldoc.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Document("firewallRule")
public class FirewallRule {

    @Id
    private String id;
    @NonNull
    private String fwTypeId;
    @NonNull
    private String contextId;
    @NonNull
    private String sourceId;
    @NonNull
    private String destinationId;
    @NonNull
    private String securityGroupObjectId;
    @NonNull
    private String useCaseId;
    private FirewallStatus firewallStatus = FirewallStatus.REQUESTED_FOR_APPROVAL;
    
}
