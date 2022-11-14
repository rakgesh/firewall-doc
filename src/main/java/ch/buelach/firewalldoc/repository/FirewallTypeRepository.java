package ch.buelach.firewalldoc.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import ch.buelach.firewalldoc.model.FirewallType;

public interface FirewallTypeRepository extends
        MongoRepository<FirewallType, String>{
    
}
