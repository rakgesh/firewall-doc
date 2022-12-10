package ch.buelach.firewalldoc.model;

import java.util.List;

public class HostGroupObjectCreateDTO {

    private String name;
    private String description;
    private List<String> membersId;

    public HostGroupObjectCreateDTO(String name, String description, List<String> membersId) {
        this.name = name;
        this.description = description;
        this.membersId = membersId;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public List<String> getMembersId() {
        return membersId;
    }

}
