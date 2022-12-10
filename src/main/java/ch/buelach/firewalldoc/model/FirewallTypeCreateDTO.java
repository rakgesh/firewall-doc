package ch.buelach.firewalldoc.model;

public class FirewallTypeCreateDTO {
    
    private String name;
    private String description;


    public FirewallTypeCreateDTO(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

}
