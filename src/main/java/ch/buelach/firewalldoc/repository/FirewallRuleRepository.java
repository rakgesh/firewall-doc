package ch.buelach.firewalldoc.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import ch.buelach.firewalldoc.model.FirewallRule;
import ch.buelach.firewalldoc.model.FirewallRuleByTypeAggregationDTO;

public interface FirewallRuleRepository extends
MongoRepository<FirewallRule, String>{

    @Aggregation("{$group: {_id: '$fwTypeId', firewallRuleIds: {$push: '$_id'},count: {$count: {}}}}")
    List<FirewallRuleByTypeAggregationDTO> getFirewallRuleByTypeAggregation();
}
