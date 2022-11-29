package ch.buelach.firewalldoc.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.buelach.firewalldoc.model.ServiceGroupObject;
import ch.buelach.firewalldoc.model.ServiceGroupObjectCreateDTO;
import ch.buelach.firewalldoc.repository.ServiceGroupObjectRepository;

@RestController
@RequestMapping("/api/service-group-object")
public class ServiceGroupObjectController {
    @Autowired
    ServiceGroupObjectRepository serviceGroupObjectRepository;

    @PostMapping("")
    public ResponseEntity<ServiceGroupObject> createServiceGroupObject(
            @RequestBody ServiceGroupObjectCreateDTO sgoDTO) {
                ServiceGroupObject sgoDAO = new ServiceGroupObject(sgoDTO.getName(), sgoDTO.getPort(), sgoDTO.getDescription());
                ServiceGroupObject sgo = serviceGroupObjectRepository.save(sgoDAO);
        return new ResponseEntity<>(sgo, HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<List<ServiceGroupObject>> getAllServiceGroupObjects() {
        List<ServiceGroupObject> allServiceGroupObjects = serviceGroupObjectRepository.findAll();
        return new ResponseEntity<>(allServiceGroupObjects, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceGroupObject> getNetworkObjectById(@PathVariable String id) {
        Optional<ServiceGroupObject> optServiceGroupObject = serviceGroupObjectRepository.findById(id);
        if (optServiceGroupObject.isPresent()) {
            return new ResponseEntity<>(optServiceGroupObject.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
