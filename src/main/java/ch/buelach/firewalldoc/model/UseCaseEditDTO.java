package ch.buelach.firewalldoc.model;

import java.util.List;

public class UseCaseEditDTO {

    private String id;
    private String name;
    private String description;
    private List<String> tags;

    public UseCaseEditDTO(String id, String name, String description, List<String> tags) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.tags = tags;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public List<String> getTags() {
        return tags;
    }
}
