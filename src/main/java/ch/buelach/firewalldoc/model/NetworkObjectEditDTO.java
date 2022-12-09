package ch.buelach.firewalldoc.model;

public class NetworkObjectEditDTO {
    private String id;
    private String name;
    private String ip;
    private String subnet;
    private String description;

    public NetworkObjectEditDTO() {
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
