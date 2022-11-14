package ch.buelach.firewalldoc.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import ch.buelach.firewalldoc.model.NetworkObject;

public interface NetworkObjectRepository extends
MongoRepository<NetworkObject, String>{
    
}
