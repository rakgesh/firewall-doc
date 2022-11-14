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

import ch.buelach.firewalldoc.model.NetworkObject;
import ch.buelach.firewalldoc.model.NetworkObjectCreateDTO;
import ch.buelach.firewalldoc.repository.NetworkObjectRepository;

@RestController
@RequestMapping("/network-object")
public class NetworkObjectController {

    @Autowired
    NetworkObjectRepository networkObjectRepository;

    @PostMapping("")
    public ResponseEntity<NetworkObject> createNetworkObject(
        @RequestBody NetworkObjectCreateDTO noDTO) {
            NetworkObject noDAO = new NetworkObject(noDTO.getName(), noDTO.getIp(), noDTO.getSubnet(), noDTO.getDescription());
            NetworkObject no = networkObjectRepository.save(noDAO);
            return new ResponseEntity<>(no, HttpStatus.CREATED);
        }

    @GetMapping("")
    public ResponseEntity<List<NetworkObject>> getAllNetworkObjects() {
        List<NetworkObject> allNetworkObjects = networkObjectRepository.findAll();
        return new ResponseEntity<>(allNetworkObjects, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NetworkObject> getNetworkObjectById(@PathVariable String id) {
        Optional<NetworkObject> optNetworkObject = networkObjectRepository.findById(id);
        if (optNetworkObject.isPresent()) {
            return new ResponseEntity<>(optNetworkObject.get(),HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
}
