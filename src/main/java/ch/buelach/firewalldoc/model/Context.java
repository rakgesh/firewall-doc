package ch.buelach.firewalldoc.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document("context")
public class Context {

    @Id
    private String id;
    private String name;
    private String ip;
    private String subnet;
    private String description;

    public Context(String name, String ip, String subnet, String description) {
        this.name = name;
        this.ip = ip;
        this.subnet = subnet;
        this.description = description;
    }

    public Context() {
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

    public void setName(String name) {
        this.name = name;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public void setSubnet(String subnet) {
        this.subnet = subnet;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    
}
