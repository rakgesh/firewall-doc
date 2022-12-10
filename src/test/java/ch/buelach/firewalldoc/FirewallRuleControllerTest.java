package ch.buelach.firewalldoc;

import static org.hamcrest.core.Is.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import ch.buelach.firewalldoc.model.FirewallRule;
import ch.buelach.firewalldoc.model.FirewallRuleCreateDTO;
import ch.buelach.firewalldoc.model.FirewallRuleEditDTO;
import ch.buelach.firewalldoc.repository.FirewallRuleRepository;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(OrderAnnotation.class)
public class FirewallRuleControllerTest {
    @Autowired
    private MockMvc mvc;
    @Autowired
    private FirewallRuleRepository firewallRuleRepository;

    @Test
    @Order(1)
    public void testPostNewFirewallRule() throws Exception {
        FirewallRuleCreateDTO fwRDTO = new FirewallRuleCreateDTO("63624cb4cad6de381d422c77", "Test Context Id v1.0",
                "Test Source Id", "Test Destination Id", "Test SGO Id", "Test Use Case Id");
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(post("/api/firewall-rule")
                .contentType("application/json")
                .content(mapper.writeValueAsBytes(fwRDTO)))
                .andExpect(status().isCreated());
                }

    @Test
    @Order(2)
    public void testGetAllFirewallRules() throws Exception {
        int i = firewallRuleRepository.findAll().size() - 1;
        String fwTypePath = "$.[" + i + "].fwTypeId";
        String contextPath = "$.[" + i + "].contextId";
        String sourcePath = "$.[" + i + "].sourceId";
        String destinationPath = "$.[" + i + "].destinationId";
        String sgoPath = "$.[" + i + "].serviceGroupObjectId";
        String useCasePath = "$.[" + i + "].useCaseId";
        String statusPath = "$.[" + i + "].firewallStatus";

        mvc.perform(get("/api/firewall-rule"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(fwTypePath, is("63624cb4cad6de381d422c77")))
                .andExpect(jsonPath(contextPath, is("Test Context Id v1.0")))
                .andExpect(jsonPath(sourcePath, is("Test Source Id")))
                .andExpect(jsonPath(destinationPath, is("Test Destination Id")))
                .andExpect(jsonPath(sgoPath, is("Test SGO Id")))
                .andExpect(jsonPath(useCasePath, is("Test Use Case Id")))
                .andExpect(jsonPath(statusPath, is("REQUESTED_FOR_APPROVAL")));

    }

    @Test
    @Order(3)
    public void testGetFirewallRuleById() throws Exception {
        List<FirewallRule> allFwR = firewallRuleRepository.findAll();
        String id = "";
        for (FirewallRule firewallRule : allFwR) {
            if (firewallRule.getContextId().equals("Test Context Id v1.0")) {
                id = firewallRule.getId();
            }
        }

        mvc.perform(get("/api/firewall-rule/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fwTypeId", is("63624cb4cad6de381d422c77")))
                .andExpect(jsonPath("$.contextId", is("Test Context Id v1.0")))
                .andExpect(jsonPath("$.sourceId", is("Test Source Id")))
                .andExpect(jsonPath("$.destinationId", is("Test Destination Id")))
                .andExpect(jsonPath("$.serviceGroupObjectId", is("Test SGO Id")))
                .andExpect(jsonPath("$.useCaseId", is("Test Use Case Id")))
                .andExpect(jsonPath("$.firewallStatus", is("REQUESTED_FOR_APPROVAL")));
    }

    @Test
    @Order(4)
    public void testGetFirewallRuleByIdWithError() throws Exception {
        String id = "empty";
        mvc.perform(get("/api/firewall-rule/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(5)
    public void testPutFirewallRule() throws Exception {
        List<FirewallRule> allFwR = firewallRuleRepository.findAll();
        String id = "";
        for (FirewallRule firewallRule : allFwR) {
            if (firewallRule.getContextId().equals("Test Context Id v1.0")) {
                id = firewallRule.getId();
            }
        }

        FirewallRuleEditDTO fwREDTO = new FirewallRuleEditDTO(id, "63624cb4cad6de381d422c77", "Test Context Id v2.0",
                "Test Source Id", "Test Destination Id", "Test SGO Id", "Test Use Case Id", "REQUESTED_FOR_APPROVAL");
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(put("/api/firewall-rule")
                .contentType("application/json")
                .content(mapper.writeValueAsBytes(fwREDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fwTypeId", is("63624cb4cad6de381d422c77")))
                .andExpect(jsonPath("$.contextId", is("Test Context Id v2.0")))
                .andExpect(jsonPath("$.sourceId", is("Test Source Id")))
                .andExpect(jsonPath("$.destinationId", is("Test Destination Id")))
                .andExpect(jsonPath("$.serviceGroupObjectId", is("Test SGO Id")))
                .andExpect(jsonPath("$.useCaseId", is("Test Use Case Id")))
                .andExpect(jsonPath("$.firewallStatus", is("REQUESTED_FOR_APPROVAL")));
    }



    @Test
    @Order(7)
    public void testDeleteFirewallRule() throws Exception{
        List<FirewallRule> allFwR = firewallRuleRepository.findAll();
        String id = "";
        for (FirewallRule firewallRule : allFwR) {
            if (firewallRule.getContextId().equals("Test Context Id v2.0")) {
                id = firewallRule.getId();
            }
        }

        mvc.perform(delete("/api/firewall-rule/{id}", id))
                .andExpect(status().isOk());
    }

    @Test
    @Order(8)
    public void testGetFirewallRuleByTypeAggregation() throws Exception {

        mvc.perform(get("/api/firewall-rule/byFwType"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[0].id", is("63624cb4cad6de381d422c77")))
                .andExpect(jsonPath("$.[0].name", is("Cisco Zonen Firewall")))
                .andExpect(jsonPath("$.[1].id", is("638b9d67ad3a355f6044babe")))
                .andExpect(jsonPath("$.[1].name", is("Sophos Perimeter Firewall")));
                
    }

}
