package ch.buelach.firewalldoc.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class NetworkGroupObjectCreateDTO {

    private String name;
    private String description;
    private List<String> membersId;
}
