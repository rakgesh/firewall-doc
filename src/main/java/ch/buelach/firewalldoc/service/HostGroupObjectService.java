package ch.buelach.firewalldoc.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public Optional<HostGroupObject> assignHoToHgroupO(String hgoID, List<String> hoIds) {

        if (hostGroupObjectRepository.findById(hgoID).isPresent()) {
            HostGroupObject hostGroupObject = hostGroupObjectRepository.findById(hgoID).get();
            List<String> hoPresent = hoIds.stream().filter(x -> hostObjectRepository.findById(x).isPresent())
                    .collect(Collectors.toList());
            if (hostGroupObject.getMembersId() != null) {
                List<String> hoNew = hoPresent.stream().filter(x -> !hostGroupObject.getMembersId().contains(x))
                        .collect(Collectors.toList());
                hostGroupObject.getMembersId().addAll(hoNew);
            } else {
                hostGroupObject.setMembersId(hoPresent);
            }
            hostGroupObjectRepository.save(hostGroupObject);
            return Optional.of(hostGroupObject);
        }
        return Optional.empty();
    }
}