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
    private HostGroupObject sHgo;
    private NetworkObject sNo;
    private NetworkGroupObject sNgo;
    private HostObject dHo;
    private HostGroupObject dHgo;
    private NetworkObject dNo;
    private NetworkGroupObject dNgo;
    private ServiceGroupObject sgo;
    private UseCase uc; 
    private FirewallStatus firewallStatus;

}
