package ch.buelach.firewalldoc.model;

public class HostObjectCreateDTO {

    private String name;
    private String ip;
    private String description;
    
    public HostObjectCreateDTO(String name, String ip, String description) {
        this.name = name;
        this.ip = ip;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public String getIp() {
        return ip;
    }

    public String getDescription() {
        return description;
    }

}
