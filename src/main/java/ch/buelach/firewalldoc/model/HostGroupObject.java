package ch.buelach.firewalldoc.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("host-group-object")
public class HostGroupObject {

    @Id
    private String id;
    private String name;
    private String description;
    private List<String> membersId;

    public HostGroupObject() {
    }

    public HostGroupObject(String name, String description, List<String> membersId) {
        this.name = name;
        this.description = description;
        this.membersId = membersId;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getMembersId() {
        return membersId;
    }

    public void setMembersId(List<String> membersId) {
        this.membersId = membersId;
    }

}
