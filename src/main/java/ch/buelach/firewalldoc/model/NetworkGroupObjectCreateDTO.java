package ch.buelach.firewalldoc.model;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class NetworkGroupObjectCreateDTO {

    private String name;
    private String description;
    private String[] membersId;
}
