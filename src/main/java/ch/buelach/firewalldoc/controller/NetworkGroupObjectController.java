package ch.buelach.firewalldoc.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.buelach.firewalldoc.model.NetworkGroupObject;
import ch.buelach.firewalldoc.model.NetworkGroupObjectCreateDTO;
import ch.buelach.firewalldoc.model.NetworkGroupObjectEditDTO;
import ch.buelach.firewalldoc.repository.NetworkGroupObjectRepository;

@RestController
@RequestMapping("/api/network-group-object")
public class NetworkGroupObjectController {

    @Autowired
    NetworkGroupObjectRepository networkGroupObjectRepository;

    @PostMapping("")
    public ResponseEntity<NetworkGroupObject> createNetworkGroupObject(
            @RequestBody NetworkGroupObjectCreateDTO ngoDTO) {
        NetworkGroupObject ngoDAO = new NetworkGroupObject(ngoDTO.getName(), ngoDTO.getDescription(), ngoDTO.getMembersId());
        NetworkGroupObject ngo = networkGroupObjectRepository.save(ngoDAO);
        return new ResponseEntity<>(ngo, HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<List<NetworkGroupObject>> getAllNetworkGroupObjects() {
        List<NetworkGroupObject> allNetworkGroupObjects = networkGroupObjectRepository.findAll();
        return new ResponseEntity<>(allNetworkGroupObjects, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NetworkGroupObject> getNetworkObjectById(@PathVariable String id) {
        Optional<NetworkGroupObject> optNetworkGroupObject = networkGroupObjectRepository.findById(id);
        if (optNetworkGroupObject.isPresent()) {
            return new ResponseEntity<>(optNetworkGroupObject.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("")
    public ResponseEntity<NetworkGroupObject> editHostGroupObject(@RequestBody NetworkGroupObjectEditDTO ngoEditDTO) {
        NetworkGroupObject ngoDAO = networkGroupObjectRepository.findById(ngoEditDTO.getId()).get();
        ngoDAO.setName(ngoEditDTO.getName());
        ngoDAO.setDescription(ngoEditDTO.getDescription());
        ngoDAO.setMembersId(ngoEditDTO.getMembersId());
        NetworkGroupObject ngo = networkGroupObjectRepository.save(ngoDAO);
        return new ResponseEntity<>(ngo, HttpStatus.OK);
    }

}
