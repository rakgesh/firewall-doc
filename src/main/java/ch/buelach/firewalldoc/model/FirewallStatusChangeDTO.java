package ch.buelach.firewalldoc.model;

public class FirewallStatusChangeDTO {

    private String fwId;
    private String status;
    private String userMail;
    

    public FirewallStatusChangeDTO(String fwId, String status) {
        this.fwId = fwId;
        this.status = status;
    }

    public String getFwId() {
        return fwId;
    }

    public String getStatus() {
        return status;
    }

    public String getUserMail() {
        return userMail;
    }
    
}
