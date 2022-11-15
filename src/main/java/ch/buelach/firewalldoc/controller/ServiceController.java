package ch.buelach.firewalldoc.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.buelach.firewalldoc.model.HostGroupObject;
import ch.buelach.firewalldoc.model.HostGroupObjectAssignDTO;
import ch.buelach.firewalldoc.service.HostGroupObjectService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/service")
public class ServiceController {
    @Autowired
    HostGroupObjectService hostGroupObjectService;

    @PostMapping("HoToHGroupo")
    public ResponseEntity<HostGroupObject> assignHoToHgroupO(@RequestBody HostGroupObjectAssignDTO assignDTO) {
        Optional<HostGroupObject> optHostGroupObject = hostGroupObjectService.assignHoToHgroupO(assignDTO.getHgoId(), assignDTO.getHoIds());
        return optHostGroupObject.isPresent() ? new ResponseEntity<>(optHostGroupObject.get(), HttpStatus.OK) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
    
}
