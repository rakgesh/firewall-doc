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

import ch.buelach.firewalldoc.model.HostGroupObject;
import ch.buelach.firewalldoc.model.HostGroupObjectCreateDTO;
import ch.buelach.firewalldoc.repository.HostGroupObjectRepository;

@RestController
@RequestMapping("/host-group-object")
public class HostGroupObjectController {
    @Autowired
    HostGroupObjectRepository hostGroupObjectRepository;

    @PostMapping("")
    public ResponseEntity<HostGroupObject> createHostGroupObject(
            @RequestBody HostGroupObjectCreateDTO hgoDTO) {
                HostGroupObject hgoDAO = new HostGroupObject(hgoDTO.getName(), hgoDTO.getDescription());
                HostGroupObject hgo = hostGroupObjectRepository.save(hgoDAO);
        return new ResponseEntity<>(hgo, HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<List<HostGroupObject>> getAllHostGroupObjects() {
        List<HostGroupObject> allHostGroupObjects = hostGroupObjectRepository.findAll();
        return new ResponseEntity<>(allHostGroupObjects, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HostGroupObject> getNetworkObjectById(@PathVariable String id) {
        Optional<HostGroupObject> optHostGroupObject = hostGroupObjectRepository.findById(id);
        if (optHostGroupObject.isPresent()) {
            return new ResponseEntity<>(optHostGroupObject.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
