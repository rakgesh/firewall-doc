package ch.buelach.firewalldoc.model;

public class NetworkObjectCreateDTO {
    
    private String name;
    private String ip;
    private String subnet;
    private String description;

    public NetworkObjectCreateDTO(String name, String ip, String subnet, String description) {
        this.name = name;
        this.ip = ip;
        this.subnet = subnet;
        this.description = description;
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
