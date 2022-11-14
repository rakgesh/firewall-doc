package ch.buelach.firewalldoc.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import ch.buelach.firewalldoc.model.HostGroupObject;

public interface HostGroupObjectRepository extends
        MongoRepository<HostGroupObject, String> {

}
