package ch.buelach.firewalldoc.model;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class NetworkObjectsToNetworkGroup {
    private String ngoId;
    private String ngoName;
    private String ngoDescription;
    private List<String> membersId;
    private List<NetworkObject> members;


}
