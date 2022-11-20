package ch.buelach.firewalldoc.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.buelach.firewalldoc.model.HostGroupObject;
import ch.buelach.firewalldoc.model.HostGroupObjectAssignDTO;
import ch.buelach.firewalldoc.model.HostObjectsToHostGroup;
import ch.buelach.firewalldoc.model.NetworkGroupObject;
import ch.buelach.firewalldoc.model.NetworkGroupObjectAssignDTO;
import ch.buelach.firewalldoc.service.HostGroupObjectService;
import ch.buelach.firewalldoc.service.NetworkGroupObjectService;


@RestController
@RequestMapping("/api/service")
public class ServiceController {
    @Autowired
    HostGroupObjectService hostGroupObjectService;
    @Autowired
    NetworkGroupObjectService networkGroupObjectService;

    @PostMapping("/HoToHGroupo")
    public ResponseEntity<HostGroupObject> assignHoToHgroupO(@RequestBody HostGroupObjectAssignDTO assignDTO) {
        Optional<HostGroupObject> optHostGroupObject = hostGroupObjectService.assignHoToHgroupO(assignDTO.getHgoId(), assignDTO.getHoIds());
        return optHostGroupObject.isPresent() ? new ResponseEntity<>(optHostGroupObject.get(), HttpStatus.OK) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/NoToNGroupo")
    public ResponseEntity<NetworkGroupObject> assignNoToNgroupO(@RequestBody NetworkGroupObjectAssignDTO assignDTO) {
        Optional<NetworkGroupObject> optNetworkGroupObject = networkGroupObjectService.assignNoToNgroupO(assignDTO.getNgoId(), assignDTO.getNoIds());
        return optNetworkGroupObject.isPresent() ? new ResponseEntity<>(optNetworkGroupObject.get(), HttpStatus.OK) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/findHo")
    public ResponseEntity<List<HostObjectsToHostGroup>> getHoOfHgroup() {
        List<HostObjectsToHostGroup> all = hostGroupObjectService.getHoOfHgroup();
        return new ResponseEntity<>(all, HttpStatus.OK);
    }
    }
    

