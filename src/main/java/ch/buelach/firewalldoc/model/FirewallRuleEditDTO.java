package ch.buelach.firewalldoc.model;

public class FirewallRuleEditDTO {

    private String id;
    private String fwTypeId;
    private String contextId;
    private String sourceId;
    private String destinationId;
    private String serviceGroupObjectId;
    private String useCaseId;
    private String firewallStatus;
    
    public FirewallRuleEditDTO() {
    }

    public String getId() {
        return id;
    }

    public String getFwTypeId() {
        return fwTypeId;
    }

    public String getContextId() {
        return contextId;
    }

    public String getSourceId() {
        return sourceId;
    }

    public String getDestinationId() {
        return destinationId;
    }

    public String getServiceGroupObjectId() {
        return serviceGroupObjectId;
    }

    public String getUseCaseId() {
        return useCaseId;
    }

    public String getFirewallStatus() {
        return firewallStatus;
    }
    
}
