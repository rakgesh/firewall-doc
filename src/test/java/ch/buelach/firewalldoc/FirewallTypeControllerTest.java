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

import ch.buelach.firewalldoc.model.FirewallType;
import ch.buelach.firewalldoc.model.FirewallTypeCreateDTO;
import ch.buelach.firewalldoc.model.FirewallTypeEditDTO;
import ch.buelach.firewalldoc.repository.FirewallTypeRepository;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(OrderAnnotation.class)
public class FirewallTypeControllerTest {
    @Autowired
    private MockMvc mvc;
    @Autowired
    private FirewallTypeRepository firewallTypeRepository;

    @Test
    @Order(1)
    public void testPostNewFirewallType() throws Exception {
        FirewallTypeCreateDTO fwTDTO = new FirewallTypeCreateDTO("Integrationtest v1.0", "Test Firewall Type für Integrationtest");
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(post("/api/firewall-type")
        .contentType("application/json")
        .content(mapper.writeValueAsBytes(fwTDTO)))
        .andExpect(status().isCreated());
    }

    @Test
    @Order(2)
    public void testGetAllFirewallType() throws Exception{
        int i = firewallTypeRepository.findAll().size() -1;
        String namePath = "$.[" +i+ "].name";
        String descriptionPath = "$.[" +i+ "].description";

        mvc.perform(get("/api/firewall-type"))
        .andExpect(status().isOk())
        .andExpect(jsonPath(namePath, is("Integrationtest v1.0")))
        .andExpect(jsonPath(descriptionPath, is("Test Firewall Type für Integrationtest")));
    }

    @Test
    @Order(3)
    public void testGetFirewallTypeById() throws Exception{
        List<FirewallType> allFwT = firewallTypeRepository.findAll();
        String id = "";
        for (FirewallType firewallType : allFwT) {
            if (firewallType.getName().equals("Integrationtest v1.0")) {
                id = firewallType.getId();
            }
        }

        mvc.perform(get("/api/firewall-type/{id}", id))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name", is("Integrationtest v1.0")))
        .andExpect(jsonPath("$.description", is("Test Firewall Type für Integrationtest")));
    }

    @Test
    @Order(4)
    public void testGetFirewallTypeByIdWithError() throws Exception{
        String id = "empty";
        mvc.perform(get("/api/firewall-type/{id}", id))
        .andExpect(status().isNotFound());

    }

    @Test
    @Order(5)
    public void testPutContext() throws Exception {
        List<FirewallType> allFwT = firewallTypeRepository.findAll();
        String id = "";
        for (FirewallType firewallType : allFwT) {
            if (firewallType.getName().equals("Integrationtest v1.0")) {
                id = firewallType.getId();
            }
        }

    FirewallTypeEditDTO fwTDTO = new FirewallTypeEditDTO(id, "Integrationtest v2.0", "Test Firewall Type für Integrationtest PUT TEST");
    ObjectMapper mapper = new ObjectMapper();
    mvc.perform(put("/api/firewall-type")
    .contentType("application/json")
    .content(mapper.writeValueAsBytes(fwTDTO)))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.name", is("Integrationtest v2.0")))
    .andExpect(jsonPath("$.description", is("Test Firewall Type für Integrationtest PUT TEST")));
    }

    @Test
    @Order(6)
    public void testDeleteUseCase() throws Exception {
        List<FirewallType> allFwT = firewallTypeRepository.findAll();
        String id = "";
        for (FirewallType firewallType : allFwT) {
            if (firewallType.getName().equals("Integrationtest v2.0")) {
                id = firewallType.getId();
            }
        }
        mvc.perform(delete("/api/firewall-type/{id}", id))
        .andExpect(status().isOk());
    }
    
}
