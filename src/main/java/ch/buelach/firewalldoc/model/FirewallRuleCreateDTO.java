package ch.buelach.firewalldoc.model;

public class FirewallRuleCreateDTO {

    private String fwTypeId;
    private String contextId;
    private String sourceId;
    private String destinationId;
    private String serviceGroupObjectId;
    private String useCaseId;
    private String userMail;

    public FirewallRuleCreateDTO(String fwTypeId, String contextId, String sourceId, String destinationId,
            String serviceGroupObjectId, String useCaseId, String userMail) {
        this.fwTypeId = fwTypeId;
        this.contextId = contextId;
        this.sourceId = sourceId;
        this.destinationId = destinationId;
        this.serviceGroupObjectId = serviceGroupObjectId;
        this.useCaseId = useCaseId;
        this.userMail = userMail;
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

    public String getUserMail() {
        return userMail;
    }

}
