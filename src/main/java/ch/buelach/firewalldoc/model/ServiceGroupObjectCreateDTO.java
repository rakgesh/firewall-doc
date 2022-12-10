package ch.buelach.firewalldoc.model;

import java.util.List;

public class ServiceGroupObjectCreateDTO {

    private String name;
    private List<String> port;
    private String description;

    public ServiceGroupObjectCreateDTO(String name, List<String> port, String description) {
        this.name = name;
        this.port = port;
        this.description = description;
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
