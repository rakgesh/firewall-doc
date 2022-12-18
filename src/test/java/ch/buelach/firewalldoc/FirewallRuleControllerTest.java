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
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import ch.buelach.firewalldoc.model.FirewallRule;
import ch.buelach.firewalldoc.model.FirewallRuleCreateDTO;
import ch.buelach.firewalldoc.model.FirewallRuleEditDTO;
import ch.buelach.firewalldoc.model.FirewallStatus;
import ch.buelach.firewalldoc.repository.FirewallRuleRepository;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(OrderAnnotation.class)
public class FirewallRuleControllerTest {
    @Autowired
    private MockMvc mvc;
    @Autowired
    private FirewallRuleRepository firewallRuleRepository;

    private String token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1yOGR4OGJ6TDZCUWZUWlZOTVBmSCJ9.eyJ1c2VyX3JvbGVzIjpbImFkbWluIl0sIm5pY2tuYW1lIjoidGVzdCIsIm5hbWUiOiJ0ZXN0QHRlc3QuY2giLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvMGIyYWM2OWMyMTA1YzRmOTE0MTUzNWY3YWM4OTVkOWU_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZ0ZS5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyMi0xMi0xN1QxNDo1MjowMC44NzBaIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY2giLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOi8vZGV2LTBhdWZqbmhjYmRqbG10NjIudXMuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDYzODY0MTA2YzBmOGFhYmZmNjRhOWQ4NiIsImF1ZCI6IkFHRUxyN2I0TzJSaHdVdDQwT2V2eWZrcDNQNTY4RDZIIiwiaWF0IjoxNjcxMjg4NzIyLCJleHAiOjE2NzM4ODA3MjIsInNpZCI6IlJWVFBDWHJrNVhhT29uc1dvMWJRbDFiVWh6NWh6Q1dRIiwibm9uY2UiOiJOa0ZSWm1JMFpVNWxla0ZvY0ZBNGZtUjRRekZZVVZSdFQyTkRaa1pDY2pWakxtMDFRV1ZOV2s1SVl3PT0ifQ.V37VjRAE-Gt18aESQBezcyf9mM6qvLrIESBjoYE3mq-QrdaImPJ3jdsghB5PXuYy6ZSWpshb5VaBn3rfHzioxjDdQboxs0xiv7TuU4QiRecwMVuPsY8qeFp0053ad7WGhFYXqmF7KjGhhmqyAcjR8MafyrNrGH6NhrycSeAgZimvmWh8yfqpM2D5YK1GVpF9ZWVBdv_aKOS9Vd73ZY8pFlrZtlJb5IVqMXjifVtTZ1vwXcPz42TI6lqcB4xSyt8I8HXG_tuA4BeT_6GsEe6xYfTPJyuDPYj_NlSouoYs5Ipfu9ACEGx5ZwCfPocI4kvhRQoypU_vBMPRvoEgPJgX2w";


    @Test
    @Order(1)
    public void testPostNewFirewallRule() throws Exception {
        FirewallRuleCreateDTO fwRDTO = new FirewallRuleCreateDTO("63624cb4cad6de381d422c77", "Test Context Id v1.0",
                "Test Source Id", "Test Destination Id", "Test SGO Id", "Test Use Case Id");
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(post("/api/firewall-rule")
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
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

        mvc.perform(get("/api/firewall-rule")
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
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

        mvc.perform(get("/api/firewall-rule/{id}", id)
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
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
        mvc.perform(get("/api/firewall-rule/{id}", id)
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
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
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
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
    @Order(6)
    public void testPutFirewallRuleWithAnotherStatus() throws Exception {
        List<FirewallRule> allFwR = firewallRuleRepository.findAll();
        String id = "";
        for (FirewallRule firewallRule : allFwR) {
            if (firewallRule.getContextId().equals("Test Context Id v2.0")) {
                id = firewallRule.getId();
            }
        }

        FirewallRule fw = firewallRuleRepository.findById(id).get();
        fw.setFirewallStatus(FirewallStatus.ACTIVE);


        FirewallRuleEditDTO fwREDTO = new FirewallRuleEditDTO(id, "63624cb4cad6de381d422c77", "Test Context Id v3.0",
                "Test Source Id", "Test Destination Id", "Test SGO Id", "Test Use Case Id", "ACTIVE");
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(put("/api/firewall-rule")
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .contentType("application/json")
                .content(mapper.writeValueAsBytes(fwREDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fwTypeId", is("63624cb4cad6de381d422c77")))
                .andExpect(jsonPath("$.contextId", is("Test Context Id v3.0")))
                .andExpect(jsonPath("$.sourceId", is("Test Source Id")))
                .andExpect(jsonPath("$.destinationId", is("Test Destination Id")))
                .andExpect(jsonPath("$.serviceGroupObjectId", is("Test SGO Id")))
                .andExpect(jsonPath("$.useCaseId", is("Test Use Case Id")))
                .andExpect(jsonPath("$.firewallStatus", is("EDITED")));
    }



    @Test
    @Order(7)
    public void testDeleteFirewallRule() throws Exception{
        List<FirewallRule> allFwR = firewallRuleRepository.findAll();
        String id = "";
        for (FirewallRule firewallRule : allFwR) {
            if (firewallRule.getContextId().equals("Test Context Id v3.0")) {
                id = firewallRule.getId();
            }
        }

        mvc.perform(delete("/api/firewall-rule/{id}", id)
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
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
