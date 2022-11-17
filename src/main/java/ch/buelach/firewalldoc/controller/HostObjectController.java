package ch.buelach.firewalldoc.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ch.buelach.firewalldoc.model.HostObject;
import ch.buelach.firewalldoc.model.HostObjectCreateDTO;
import ch.buelach.firewalldoc.repository.HostObjectRepository;

@RestController
@RequestMapping("/host-object")
public class HostObjectController {
    @Autowired
    HostObjectRepository hostObjectRepository;

    @PostMapping("")
    public ResponseEntity<HostObject> createHostObject(
            @RequestBody HostObjectCreateDTO hoDTO) {
                HostObject hoDAO = new HostObject(hoDTO.getName(), hoDTO.getIp(), hoDTO.getDescription());
                HostObject ho = hostObjectRepository.save(hoDAO);
        return new ResponseEntity<>(ho, HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<List<HostObject>> getAllHostObjects() {
        List<HostObject> allHostObjects = hostObjectRepository.findAll(Sort.by(Sort.Direction.ASC, "name")); // sortierung 
        return new ResponseEntity<>(allHostObjects, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HostObject> getNetworkObjectById(@PathVariable String id) {
        Optional<HostObject> optHostObject = hostObjectRepository.findById(id);
        if (optHostObject.isPresent()) {
            return new ResponseEntity<>(optHostObject.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/searchHostObjectName")
    public ResponseEntity<List<HostObject>> getByName(@RequestParam String letters) {
        return new ResponseEntity<>(hostObjectRepository.findByNameContaining(letters), HttpStatus.OK);
    }

}
