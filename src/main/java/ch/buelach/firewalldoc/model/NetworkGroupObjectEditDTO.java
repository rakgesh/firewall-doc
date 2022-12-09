package ch.buelach.firewalldoc.model;

import java.util.List;

public class NetworkGroupObjectEditDTO {

    private String id;
    private String name;
    private String description;
    private List<String> membersId;

    public NetworkGroupObjectEditDTO() {
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

    public List<String> getMembersId() {
        return membersId;
    }
    
}
