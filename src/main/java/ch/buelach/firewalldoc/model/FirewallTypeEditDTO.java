package ch.buelach.firewalldoc.model;

public class FirewallTypeEditDTO {
    
    private String id;
    private String name;
    private String description;

    public FirewallTypeEditDTO(String id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
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

}
