package ch.buelach.firewalldoc.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import ch.buelach.firewalldoc.model.ServiceGroupObject;

public interface ServiceGroupObjectRepository extends
        MongoRepository<ServiceGroupObject, String> {

}
