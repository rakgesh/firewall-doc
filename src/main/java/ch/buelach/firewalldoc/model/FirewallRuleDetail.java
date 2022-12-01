package ch.buelach.firewalldoc.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class FirewallRuleDetail {
    private String fwId;
    private FirewallType fwType;
    private Context context;
    private HostObject sHo;
    private HostObjectsToHostGroup sHgoWithHo;
    private NetworkObject sNo;
    private NetworkObjectsToNetworkGroup sNgoWithNo;
    private HostObject dHo;
    private HostObjectsToHostGroup dHgoWithHo;
    private NetworkObject dNo;
    private NetworkObjectsToNetworkGroup dNgoWithNo;
    private ServiceGroupObject sgo;
    private UseCase uc; 
    private FirewallStatus firewallStatus;

}
