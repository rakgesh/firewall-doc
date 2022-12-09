package ch.buelach.firewalldoc.model;

public class ContextCreateDTO {
    private String name;
    private String ip;
    private String subnet;
    private String description;

    public ContextCreateDTO() {
    }

    public String getName() {
        return name;
    }

    public String getIp() {
        return ip;
    }

    public String getSubnet() {
        return subnet;
    }

    public String getDescription() {
        return description;
    }
    
}
