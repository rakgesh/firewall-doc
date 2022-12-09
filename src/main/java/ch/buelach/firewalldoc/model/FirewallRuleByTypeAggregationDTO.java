package ch.buelach.firewalldoc.model;

import java.util.List;

public class FirewallRuleByTypeAggregationDTO {
    private String id;
    private String name;
    private List<String> firewallRuleIds;
    private String count;

    public FirewallRuleByTypeAggregationDTO() {
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getFirewallRuleIds() {
        return firewallRuleIds;
    }

    public String getCount() {
        return count;
    }
    
}
