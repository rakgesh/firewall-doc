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
            if (noDAO.getSubnet().equals("128.0.0.0")) {
                noDAO.setSubnet("/1");
            } else if (noDAO.getSubnet().equals("192.0.0.0")) {
                noDAO.setSubnet("/2");
            } else if (noDAO.getSubnet().equals("224.0.0.0")) {
                noDAO.setSubnet("/3");
            } else if (noDAO.getSubnet().equals("240.0.0.0")) {
                noDAO.setSubnet("/4");
            } else if (noDAO.getSubnet().equals("248.0.0.0")) {
                noDAO.setSubnet("/5");
            } else if (noDAO.getSubnet().equals("252.0.0.0")) {
                noDAO.setSubnet("/6");
            } else if (noDAO.getSubnet().equals("254.0.0.0")) {
                noDAO.setSubnet("/7");
            } else if (noDAO.getSubnet().equals("255.0.0.0")) {
                noDAO.setSubnet("/8");
            } else if (noDAO.getSubnet().equals("255.128.0.0")) {
                noDAO.setSubnet("/9");
            } else if (noDAO.getSubnet().equals("255.192.0.0")) {
                noDAO.setSubnet("/10");
            } else if (noDAO.getSubnet().equals("255.224.0.0")) {
                noDAO.setSubnet("/11");
            } else if (noDAO.getSubnet().equals("255.240.0.0")) {
                noDAO.setSubnet("/12");
            } else if (noDAO.getSubnet().equals("255.248.0.0")) {
                noDAO.setSubnet("/13");
            } else if (noDAO.getSubnet().equals("255.252.0.0")) {
                noDAO.setSubnet("/14");
            } else if (noDAO.getSubnet().equals("255.254.0.0")) {
                noDAO.setSubnet("/15");
            } else if (noDAO.getSubnet().equals("255.255.0.0")) {
                noDAO.setSubnet("/16");
            } else if (noDAO.getSubnet().equals("255.255.128.0")) {
                noDAO.setSubnet("/17");
            } else if (noDAO.getSubnet().equals("255.255.192.0")) {
                noDAO.setSubnet("/18");
            } else if (noDAO.getSubnet().equals("255.255.224.0")) {
                noDAO.setSubnet("/19");
            } else if (noDAO.getSubnet().equals("255.255.240.0")) {
                noDAO.setSubnet("/20");
            } else if (noDAO.getSubnet().equals("255.255.248.0")) {
                noDAO.setSubnet("/21");  
            } else if (noDAO.getSubnet().equals("255.255.252.0")) {
                noDAO.setSubnet("/22");
            } else if (noDAO.getSubnet().equals("255.255.254.0")) {
                noDAO.setSubnet("/23");
            } else if (noDAO.getSubnet().equals("255.255.255.0")) {
                noDAO.setSubnet("/24");
            } else if (noDAO.getSubnet().equals("255.255.255.128")) {
                noDAO.setSubnet("/25");
            } else if (noDAO.getSubnet().equals("255.255.255.192")) {
                noDAO.setSubnet("/26");
            } else if (noDAO.getSubnet().equals("255.255.255.224")) {
                noDAO.setSubnet("/27");
            } else if (noDAO.getSubnet().equals("255.255.255.240")) {
                noDAO.setSubnet("/28");
            } else if (noDAO.getSubnet().equals("255.255.255.248")) {
                noDAO.setSubnet("/29");
            } else if (noDAO.getSubnet().equals("255.255.255.252")) {
                noDAO.setSubnet("/30");
            } else if (noDAO.getSubnet().equals("255.255.255.254")) {
                noDAO.setSubnet("/31");
            } else if (noDAO.getSubnet().equals("255.255.255.255")) {
                noDAO.setSubnet("/32");
            } 
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
