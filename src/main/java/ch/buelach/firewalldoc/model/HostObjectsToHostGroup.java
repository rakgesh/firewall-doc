package ch.buelach.firewalldoc.model;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class HostObjectsToHostGroup {
    private String hgoId;
    private String hgoName;
    private String hgoDescription;
    private List<String> membersId;
    private List<HostObject> members;


}
