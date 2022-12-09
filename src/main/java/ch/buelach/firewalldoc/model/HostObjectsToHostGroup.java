package ch.buelach.firewalldoc.model;

import java.util.List;

public class HostObjectsToHostGroup {
    private String hgoId;
    private String hgoName;
    private String hgoDescription;
    private List<String> membersId;
    private List<HostObject> members;
    
    public HostObjectsToHostGroup() {
    }

    public String getHgoId() {
        return hgoId;
    }

    public void setHgoId(String hgoId) {
        this.hgoId = hgoId;
    }

    public String getHgoName() {
        return hgoName;
    }

    public void setHgoName(String hgoName) {
        this.hgoName = hgoName;
    }

    public String getHgoDescription() {
        return hgoDescription;
    }

    public void setHgoDescription(String hgoDescription) {
        this.hgoDescription = hgoDescription;
    }

    public List<String> getMembersId() {
        return membersId;
    }

    public void setMembersId(List<String> membersId) {
        this.membersId = membersId;
    }

    public List<HostObject> getMembers() {
        return members;
    }

    public void setMembers(List<HostObject> members) {
        this.members = members;
    }


}
