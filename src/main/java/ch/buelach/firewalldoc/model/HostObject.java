package ch.buelach.firewalldoc.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("host-object")
public class HostObject {

    @Id
    private String id;
    private String name;
    private String ip;
    private String description;

    public HostObject(String name, String ip, String description) {
        this.name = name;
        this.ip = ip;
        this.description = description;
    }

    public HostObject() {
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    
}
