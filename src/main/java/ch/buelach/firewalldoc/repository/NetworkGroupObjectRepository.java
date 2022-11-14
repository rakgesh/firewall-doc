package ch.buelach.firewalldoc.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import ch.buelach.firewalldoc.model.NetworkGroupObject;

public interface NetworkGroupObjectRepository extends
MongoRepository<NetworkGroupObject, String> {
    
}
