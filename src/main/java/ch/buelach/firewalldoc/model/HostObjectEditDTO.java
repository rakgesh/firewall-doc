package ch.buelach.firewalldoc.model;


public class HostObjectEditDTO {

    private String id;
    private String name;
    private String ip;
    private String description;

    public HostObjectEditDTO(String id, String name, String ip, String description) {
        this.id = id;
        this.name = name;
        this.ip = ip;
        this.description = description;
    }
    
    public String getId() {
        return id;
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
