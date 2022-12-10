package ch.buelach.firewalldoc.model;

public class NetworkObjectEditDTO {
    private String id;
    private String name;
    private String ip;
    private String subnet;
    private String description;


    public NetworkObjectEditDTO(String id, String name, String ip, String subnet, String description) {
        this.id = id;
        this.name = name;
        this.ip = ip;
        this.subnet = subnet;
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

    public String getSubnet() {
        return subnet;
    }

    public String getDescription() {
        return description;
    }
}
