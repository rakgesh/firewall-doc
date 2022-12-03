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

import ch.buelach.firewalldoc.model.NetworkObject;
import ch.buelach.firewalldoc.model.NetworkObjectCreateDTO;
import ch.buelach.firewalldoc.model.NetworkObjectEditDTO;
import ch.buelach.firewalldoc.repository.NetworkObjectRepository;

@RestController
@RequestMapping("/api/network-object")
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

    @PutMapping("")
    public ResponseEntity<NetworkObject> editNetworkObject(@RequestBody NetworkObjectEditDTO noEditDTO) {
        NetworkObject noDAO = networkObjectRepository.findById(noEditDTO.getId()).get();
        noDAO.setName(noEditDTO.getName());
        noDAO.setIp(noEditDTO.getIp());
        noDAO.setSubnet(noEditDTO.getSubnet());
        noDAO.setDescription(noEditDTO.getDescription());
        NetworkObject no = networkObjectRepository.save(noDAO);
        return new ResponseEntity<>(no, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<NetworkObject> getNetworkObjectToDeleteById(@PathVariable String id) {
        NetworkObject no = networkObjectRepository.findById(id).get();
        networkObjectRepository.delete(no);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
}
