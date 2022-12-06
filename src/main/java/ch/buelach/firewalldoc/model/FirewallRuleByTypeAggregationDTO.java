package ch.buelach.firewalldoc.model;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FirewallRuleByTypeAggregationDTO {
    private String id;
    private List<String> firewallRuleIds;
    private String count;
    
}
