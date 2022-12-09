package ch.buelach.firewalldoc.model;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
public class FirewallRuleByTypeAggregationDTO {
    private String id;
    @Setter
    private String name;
    private List<String> firewallRuleIds;
    private String count;
    
}
