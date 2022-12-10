package ch.buelach.firewalldoc.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("firewallRule")
public class FirewallRule {

    @Id
    private String id;
    private String fwTypeId;
    private String contextId;
    private String sourceId;
    private String destinationId;
    private String serviceGroupObjectId;
    private String useCaseId;
    private FirewallStatus firewallStatus = FirewallStatus.REQUESTED_FOR_APPROVAL;

    
    public FirewallRule() {
    }


    public FirewallRule(String fwTypeId, String contextId, String sourceId, String destinationId,
            String serviceGroupObjectId, String useCaseId) {
        this.fwTypeId = fwTypeId;
        this.contextId = contextId;
        this.sourceId = sourceId;
        this.destinationId = destinationId;
        this.serviceGroupObjectId = serviceGroupObjectId;
        this.useCaseId = useCaseId;
    }


    public String getId() {
        return id;
    }

    public String getFwTypeId() {
        return fwTypeId;
    }


    public void setFwTypeId(String fwTypeId) {
        this.fwTypeId = fwTypeId;
    }


    public String getContextId() {
        return contextId;
    }


    public void setContextId(String contextId) {
        this.contextId = contextId;
    }


    public String getSourceId() {
        return sourceId;
    }


    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }


    public String getDestinationId() {
        return destinationId;
    }


    public void setDestinationId(String destinationId) {
        this.destinationId = destinationId;
    }


    public String getServiceGroupObjectId() {
        return serviceGroupObjectId;
    }


    public void setServiceGroupObjectId(String serviceGroupObjectId) {
        this.serviceGroupObjectId = serviceGroupObjectId;
    }


    public String getUseCaseId() {
        return useCaseId;
    }


    public void setUseCaseId(String useCaseId) {
        this.useCaseId = useCaseId;
    }


    public FirewallStatus getFirewallStatus() {
        return firewallStatus;
    }


    public void setFirewallStatus(FirewallStatus firewallStatus) {
        this.firewallStatus = firewallStatus;
    }
    
}
