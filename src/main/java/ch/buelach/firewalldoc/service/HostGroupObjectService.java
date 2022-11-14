package ch.buelach.firewalldoc.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.buelach.firewalldoc.model.HostGroupObject;
import ch.buelach.firewalldoc.repository.HostGroupObjectRepository;
import ch.buelach.firewalldoc.repository.HostObjectRepository;

@Service
public class HostGroupObjectService {

    @Autowired
    HostGroupObjectRepository hostGroupObjectRepository;
    @Autowired
    HostObjectRepository hostObjectRepository;

    public Optional<HostGroupObject> assignHostObjectsToHostGroupObject(String hgoID, String[] hoIds) {
        
        int count = 0;

        for (int i = 0; i < hoIds.length; i++) {
            if (hostObjectRepository.findById(hoIds[i]).isPresent()) {
                count++;
            }
                Optional<HostGroupObject> hostGroupObjectToAssign = hostGroupObjectRepository.findById(hgoID);
                if (hostGroupObjectToAssign.isPresent()) {
                    HostGroupObject hgo = hostGroupObjectToAssign.get();
                    if (count == (hoIds.length-1)) {
                        hgo.setMembersId(hoIds);
                        hostGroupObjectRepository.save(hgo);
                        return Optional.of(hgo);
                    }
                }   
            }
            return Optional.empty();
        }
    }
