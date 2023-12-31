package ch.buelach.firewalldoc.model;

import java.util.List;

public class ServiceGroupObjectEditDTO {

    private String id;
    private String name;
    private List<String> port;
    private String description;

    public ServiceGroupObjectEditDTO(String id, String name, List<String> port, String description) {
        this.id = id;
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

    public List<String> getPort() {
        return port;
    }

    public String getDescription() {
        return description;
    }

}
