package ch.buelach.firewalldoc.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("network-group-object")
public class NetworkGroupObject {

    @Id
    private String id;
    private String name;
    private String description;
    private List<String> membersId;
    
    public NetworkGroupObject(String name, String description, List<String> membersId) {
        this.name = name;
        this.description = description;
        this.membersId = membersId;
    }

    public NetworkGroupObject() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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
