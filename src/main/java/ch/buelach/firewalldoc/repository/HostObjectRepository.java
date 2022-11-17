package ch.buelach.firewalldoc.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import ch.buelach.firewalldoc.model.HostObject;

public interface HostObjectRepository extends
        MongoRepository<HostObject, String> {
                List<HostObject> findByNameContaining(String name);

}
