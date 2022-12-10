package ch.buelach.firewalldoc;

import static org.hamcrest.core.Is.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import ch.buelach.firewalldoc.model.FirewallRule;
import ch.buelach.firewalldoc.model.FirewallRuleCreateDTO;
import ch.buelach.firewalldoc.model.FirewallStatusChangeDTO;
import ch.buelach.firewalldoc.repository.FirewallRuleRepository;

@SpringBootTest
@AutoConfigureMockMvc
public class ServiceControllerTest {
    @Autowired
    private MockMvc mvc;
    @Autowired
    private FirewallRuleRepository firewallRuleRepository;

    @Test
    public void testGetAllHoOfHgroup() throws Exception {

        mvc.perform(get("/api/service/findHo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[0].hgoId", is("6373649de808a17e7e70001e")))
                .andExpect(jsonPath("$.[0].hgoName", is("HG_RZ_BUL-DC-Server")))
                .andExpect(jsonPath("$.[0].hgoDescription", is("Alle AD DC in der RZ Zone")))
                .andExpect(jsonPath("$.[0].membersId").isArray())
                .andExpect(jsonPath("$.[0].membersId[0]", is("6372b30dd60f6d4c34085521")))
                .andExpect(jsonPath("$.[0].membersId[1]", is("6372b31bd60f6d4c34085522")))
                .andExpect(jsonPath("$.[0].members").isArray())
                .andExpect(jsonPath("$.[0].members[0].id", is("6372b30dd60f6d4c34085521")))
                .andExpect(jsonPath("$.[0].members[0].name", is("H_RZ_BUL-DC01")))
                .andExpect(jsonPath("$.[0].members[0].ip", is("172.31.1.10")))
                .andExpect(jsonPath("$.[0].members[0].description", is("Primary AD DC Server")))
                .andExpect(jsonPath("$.[0].members[1].id", is("6372b31bd60f6d4c34085522")))
                .andExpect(jsonPath("$.[0].members[1].name", is("H_RZ_BUL-DC02")))
                .andExpect(jsonPath("$.[0].members[1].ip", is("172.31.1.11")))
                .andExpect(jsonPath("$.[0].members[1].description", is("Secondary AD DC Server")));
    }

    @Test
    public void testGetAllNoOfNgroup() throws Exception {

        mvc.perform(get("/api/service/findNo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[0].ngoId", is("636f9fddc021af45cf24290f")))
                .andExpect(jsonPath("$.[0].ngoName", is("NG_OFFTRCL")))
                .andExpect(jsonPath("$.[0].ngoDescription", is("Alle OFFTRCL Netze")))
                .andExpect(jsonPath("$.[0].membersId").isArray())
                .andExpect(jsonPath("$.[0].membersId[0]", is("636f9e15c021af45cf24290d")))
                .andExpect(jsonPath("$.[0].membersId[1]", is("636f9e3fc021af45cf24290e")))
                .andExpect(jsonPath("$.[0].members").isArray())
                .andExpect(jsonPath("$.[0].members[0].id", is("636f9e15c021af45cf24290d")))
                .andExpect(jsonPath("$.[0].members[0].name", is("N_OFFTRCL_STHA")))
                .andExpect(jsonPath("$.[0].members[0].ip", is("172.18.20.0")))
                .andExpect(jsonPath("$.[0].members[0].subnet", is("/24")))
                .andExpect(jsonPath("$.[0].members[0].description", is("OFFTRCL Stadthaus")))
                .andExpect(jsonPath("$.[0].members[1].id", is("636f9e3fc021af45cf24290e")))
                .andExpect(jsonPath("$.[0].members[1].name", is("N_OFFTRCL_RATH")))
                .andExpect(jsonPath("$.[0].members[1].ip", is("172.18.8.0")))
                .andExpect(jsonPath("$.[0].members[1].subnet", is("/24")))
                .andExpect(jsonPath("$.[0].members[1].description", is("OFFTRCL Rathaus")));
    }

    @Test
    public void testGetAllFirewallRuleDetail() throws Exception {

        mvc.perform(get("/api/service/findFwD"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[0].fwId", is("6385246e49775a0e240fd292")))
                .andExpect(jsonPath("$.[0].fwType.id", is("63624cb4cad6de381d422c77")))
                .andExpect(jsonPath("$.[0].fwType.name", is("Cisco Zonen Firewall")))
                .andExpect(jsonPath("$.[0].fwType.description",
                        is("Kommunikation innerhalb der Zonen verläuft über diese Firewall")))
                .andExpect(jsonPath("$.[0].context.id", is("637f98517cba0070daec8f83")))
                .andExpect(jsonPath("$.[0].context.name", is("RZ")))
                .andExpect(jsonPath("$.[0].context.ip", is("172.31.0.0")))
                .andExpect(jsonPath("$.[0].context.subnet", is("/17")))
                .andExpect(jsonPath("$.[0].context.description", is("Servernetz GOV")))
                .andExpect(jsonPath("$.[0].sNo.id", is("636f9e15c021af45cf24290d")))
                .andExpect(jsonPath("$.[0].sNo.name", is("N_OFFTRCL_STHA")))
                .andExpect(jsonPath("$.[0].sNo.ip", is("172.18.20.0")))
                .andExpect(jsonPath("$.[0].sNo.subnet", is("/24")))
                .andExpect(jsonPath("$.[0].sNo.description", is("OFFTRCL Stadthaus")))
                .andExpect(jsonPath("$.[0].dHo.id", is("6375641f96445c4d8cf07a87")))
                .andExpect(jsonPath("$.[0].dHo.name", is("H_RZ_BUL-CTXIT2")))
                .andExpect(jsonPath("$.[0].dHo.ip", is("172.31.1.69")))
                .andExpect(jsonPath("$.[0].dHo.description", is("ICT Management Server")))
                .andExpect(jsonPath("$.[0].sgo.id", is("63851f5649775a0e240fd28f")))
                .andExpect(jsonPath("$.[0].sgo.name", is("SG_RDP")))
                .andExpect(jsonPath("$.[0].sgo.port").isArray())
                .andExpect(jsonPath("$.[0].sgo.port[0]", is("tcp/3389")))
                .andExpect(jsonPath("$.[0].sgo.port[1]", is("udp/3389")))
                .andExpect(jsonPath("$.[0].sgo.description", is("RDP Ports")))
                .andExpect(jsonPath("$.[0].uc.id", is("6385245f49775a0e240fd291")))
                .andExpect(jsonPath("$.[0].uc.name", is("Zugriff auf Management Server")))
                .andExpect(jsonPath("$.[0].uc.description", is("Zugriff von OFFTRCL im Stadthaus auf BUL-CTXIT2")))
                .andExpect(jsonPath("$.[0].uc.tags").isArray())
                .andExpect(jsonPath("$.[0].uc.tags[0]", is("OFFTRCL")))
                .andExpect(jsonPath("$.[0].uc.tags[1]", is("Stadthaus")))
                .andExpect(jsonPath("$.[0].uc.tags[2]", is("Management Server")))
                .andExpect(jsonPath("$.[0].uc.tags[3]", is("ICT")))
                .andExpect(jsonPath("$.[0].uc.tags[4]", is("Test")))
                .andExpect(jsonPath("$.[0].firewallStatus", is("REQUESTED_FOR_APPROVAL")));
    }

    @Test
    public void testPostNewFirewallRule() throws Exception {
        FirewallRuleCreateDTO fwRDTO = new FirewallRuleCreateDTO("63624cb4cad6de381d422c77",
                "Test Status Change Context Id v1.0",
                "Test Source Id", "Test Destination Id", "Test SGO Id", "Test Use Case Id");
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(post("/api/firewall-rule")
                .contentType("application/json")
                .content(mapper.writeValueAsBytes(fwRDTO)))
                .andExpect(status().isCreated());

        List<FirewallRule> allFwR = firewallRuleRepository.findAll();
        String id = "";
        for (FirewallRule firewallRule : allFwR) {
            if (firewallRule.getContextId().equals("Test Status Change Context Id v1.0")) {
                id = firewallRule.getId();
            }
        }

        // ---APPROVED---

        FirewallStatusChangeDTO fwSDTOApproved = new FirewallStatusChangeDTO(id, "APPROVED");
        ObjectMapper mapperApproved = new ObjectMapper();
        mvc.perform(post("/api/service/change-status")
                .contentType("application/json")
                .content(mapperApproved.writeValueAsBytes(fwSDTOApproved)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fwTypeId", is("63624cb4cad6de381d422c77")))
                .andExpect(jsonPath("$.contextId", is("Test Status Change Context Id v1.0")))
                .andExpect(jsonPath("$.sourceId", is("Test Source Id")))
                .andExpect(jsonPath("$.destinationId", is("Test Destination Id")))
                .andExpect(jsonPath("$.serviceGroupObjectId", is("Test SGO Id")))
                .andExpect(jsonPath("$.useCaseId", is("Test Use Case Id")))
                .andExpect(jsonPath("$.firewallStatus", is("APPROVED")));

        // ---ORDERED---

        FirewallStatusChangeDTO fwSDTOOrdered = new FirewallStatusChangeDTO(id, "ORDERED");
        ObjectMapper mapperOrdered = new ObjectMapper();
        mvc.perform(post("/api/service/change-status")
                .contentType("application/json")
                .content(mapperOrdered.writeValueAsBytes(fwSDTOOrdered)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fwTypeId", is("63624cb4cad6de381d422c77")))
                .andExpect(jsonPath("$.contextId", is("Test Status Change Context Id v1.0")))
                .andExpect(jsonPath("$.sourceId", is("Test Source Id")))
                .andExpect(jsonPath("$.destinationId", is("Test Destination Id")))
                .andExpect(jsonPath("$.serviceGroupObjectId", is("Test SGO Id")))
                .andExpect(jsonPath("$.useCaseId", is("Test Use Case Id")))
                .andExpect(jsonPath("$.firewallStatus", is("ORDERED")));

        // ---ACTIVE---

        FirewallStatusChangeDTO fwSDTOActive = new FirewallStatusChangeDTO(id, "ACTIVE");
        ObjectMapper mapperActive = new ObjectMapper();
        mvc.perform(post("/api/service/change-status")
                .contentType("application/json")
                .content(mapperActive.writeValueAsBytes(fwSDTOActive)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fwTypeId", is("63624cb4cad6de381d422c77")))
                .andExpect(jsonPath("$.contextId", is("Test Status Change Context Id v1.0")))
                .andExpect(jsonPath("$.sourceId", is("Test Source Id")))
                .andExpect(jsonPath("$.destinationId", is("Test Destination Id")))
                .andExpect(jsonPath("$.serviceGroupObjectId", is("Test SGO Id")))
                .andExpect(jsonPath("$.useCaseId", is("Test Use Case Id")))
                .andExpect(jsonPath("$.firewallStatus", is("ACTIVE")));

        // ---DISABLED---

        FirewallStatusChangeDTO fwSDTODisabled = new FirewallStatusChangeDTO(id, "DISABLED");
        ObjectMapper mapperDisabled = new ObjectMapper();
        mvc.perform(post("/api/service/change-status")
                .contentType("application/json")
                .content(mapperDisabled.writeValueAsBytes(fwSDTODisabled)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fwTypeId", is("63624cb4cad6de381d422c77")))
                .andExpect(jsonPath("$.contextId", is("Test Status Change Context Id v1.0")))
                .andExpect(jsonPath("$.sourceId", is("Test Source Id")))
                .andExpect(jsonPath("$.destinationId", is("Test Destination Id")))
                .andExpect(jsonPath("$.serviceGroupObjectId", is("Test SGO Id")))
                .andExpect(jsonPath("$.useCaseId", is("Test Use Case Id")))
                .andExpect(jsonPath("$.firewallStatus", is("DISABLED")));

        // ---DELETED---

        FirewallStatusChangeDTO fwSDTODeleted = new FirewallStatusChangeDTO(id, "DELETED");
        ObjectMapper mapperDeleted = new ObjectMapper();
        mvc.perform(post("/api/service/change-status")
                .contentType("application/json")
                .content(mapperDeleted.writeValueAsBytes(fwSDTODeleted)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fwTypeId", is("63624cb4cad6de381d422c77")))
                .andExpect(jsonPath("$.contextId", is("Test Status Change Context Id v1.0")))
                .andExpect(jsonPath("$.sourceId", is("Test Source Id")))
                .andExpect(jsonPath("$.destinationId", is("Test Destination Id")))
                .andExpect(jsonPath("$.serviceGroupObjectId", is("Test SGO Id")))
                .andExpect(jsonPath("$.useCaseId", is("Test Use Case Id")))
                .andExpect(jsonPath("$.firewallStatus", is("DELETED")));

        // ---REJECTED---

        FirewallStatusChangeDTO fwSDTORejected = new FirewallStatusChangeDTO(id, "REJECTED");
        ObjectMapper mapperRejected = new ObjectMapper();
        mvc.perform(post("/api/service/change-status")
                .contentType("application/json")
                .content(mapperRejected.writeValueAsBytes(fwSDTORejected)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fwTypeId", is("63624cb4cad6de381d422c77")))
                .andExpect(jsonPath("$.contextId", is("Test Status Change Context Id v1.0")))
                .andExpect(jsonPath("$.sourceId", is("Test Source Id")))
                .andExpect(jsonPath("$.destinationId", is("Test Destination Id")))
                .andExpect(jsonPath("$.serviceGroupObjectId", is("Test SGO Id")))
                .andExpect(jsonPath("$.useCaseId", is("Test Use Case Id")))
                .andExpect(jsonPath("$.firewallStatus", is("REJECTED")));

        mvc.perform(delete("/api/firewall-rule/{id}", id))
                .andExpect(status().isOk());

    }
}
