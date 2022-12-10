package ch.buelach.firewalldoc.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("service-group-object")
public class ServiceGroupObject {

    @Id
    private String id;
    private String name;
    private List<String> port;
    private String description;

    public ServiceGroupObject() {
    }

    public ServiceGroupObject(String name, List<String> port, String description) {
        this.name = name;
        this.port = port;
        this.description = description;
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

    public List<String> getPort() {
        return port;
    }

    public void setPort(List<String> port) {
        this.port = port;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
