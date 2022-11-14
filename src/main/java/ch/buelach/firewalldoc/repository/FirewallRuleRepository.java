package ch.buelach.firewalldoc.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import ch.buelach.firewalldoc.model.FirewallRule;

public interface FirewallRuleRepository extends
MongoRepository<FirewallRule, String>{
    
}
