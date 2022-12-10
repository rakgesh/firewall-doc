package ch.buelach.firewalldoc.model;

import java.util.List;

public class UseCaseCreateDTO {
    private String name;
    private String description;
    private List<String> tags;

    public UseCaseCreateDTO(String name, String description, List<String> tags) {
        this.name = name;
        this.description = description;
        this.tags = tags;
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
