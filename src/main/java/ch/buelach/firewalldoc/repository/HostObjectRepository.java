package ch.buelach.firewalldoc.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import ch.buelach.firewalldoc.model.HostObject;

public interface HostObjectRepository extends
        MongoRepository<HostObject, String> {

}
