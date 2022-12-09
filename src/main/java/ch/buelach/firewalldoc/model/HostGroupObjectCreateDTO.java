package ch.buelach.firewalldoc.model;

import java.util.List;

public class HostGroupObjectCreateDTO {

    private String name;
    private String description;
    private List<String> membersId;

    public HostGroupObjectCreateDTO() {
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
