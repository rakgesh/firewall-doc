package ch.buelach.firewalldoc.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.buelach.firewalldoc.model.HostGroupObject;
import ch.buelach.firewalldoc.model.HostGroupObjectCreateDTO;
import ch.buelach.firewalldoc.model.HostGroupObjectEditDTO;
import ch.buelach.firewalldoc.repository.HostGroupObjectRepository;

@RestController
@RequestMapping("/api/host-group-object")
public class HostGroupObjectController {
    @Autowired
    HostGroupObjectRepository hostGroupObjectRepository;

    @PostMapping("")
    public ResponseEntity<HostGroupObject> createHostGroupObject(
            @RequestBody HostGroupObjectCreateDTO hgoDTO) {
                HostGroupObject hgoDAO = new HostGroupObject(hgoDTO.getName(), hgoDTO.getDescription(), hgoDTO.getMembersId());
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

    @PutMapping("")
    public ResponseEntity<HostGroupObject> editHostGroupObject(@RequestBody HostGroupObjectEditDTO hgoEditDTO) {
        HostGroupObject hgoDAO = hostGroupObjectRepository.findById(hgoEditDTO.getId()).get();
        hgoDAO.setName(hgoEditDTO.getName());
        hgoDAO.setDescription(hgoEditDTO.getDescription());
        hgoDAO.setMembersId(hgoEditDTO.getMembersId());
        HostGroupObject hgo = hostGroupObjectRepository.save(hgoDAO);
        return new ResponseEntity<>(hgo, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HostGroupObject> getHostGroupObjectToDeleteById(@PathVariable String id) {
        HostGroupObject hgo = hostGroupObjectRepository.findById(id).get();
        hostGroupObjectRepository.delete(hgo);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
