package ch.buelach.firewalldoc.model;

import java.util.List;

public class UseCaseEditDTO {

    private String id;
    private String name;
    private String description;
    private List<String> tags;

    public UseCaseEditDTO() {
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
