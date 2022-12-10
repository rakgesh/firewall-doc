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

import ch.buelach.firewalldoc.model.NetworkObject;
import ch.buelach.firewalldoc.model.NetworkObjectCreateDTO;
import ch.buelach.firewalldoc.model.NetworkObjectEditDTO;
import ch.buelach.firewalldoc.repository.NetworkObjectRepository;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(OrderAnnotation.class)
public class NetworkObjectControllerTest {
    @Autowired
    private MockMvc mvc;
    @Autowired
    private NetworkObjectRepository networkObjectRepository;

    @Test
    @Order(1)
    public void testPostNewNetworkObject() throws Exception {
        NetworkObjectCreateDTO noDTO = new NetworkObjectCreateDTO("Integrationtest v1.0", "1.2.3.4", "/32", "Test Network Object für Integrationtest");
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(post("/api/network-object")
        .contentType("application/json")
        .content(mapper.writeValueAsBytes(noDTO)))
        .andExpect(status().isCreated());
    }

    @Test
    @Order(2)
    public void testGetAllNetworkObjects() throws Exception{
        int i = networkObjectRepository.findAll().size() -1;
        String namePath = "$.[" +i+ "].name";
        String ipPath = "$.[" +i+ "].ip";
        String subnetPath = "$.[" +i+ "].subnet";
        String descriptionPath = "$.[" +i+ "].description";

        mvc.perform(get("/api/network-object"))
        .andExpect(status().isOk())
        .andExpect(jsonPath(namePath, is("Integrationtest v1.0")))
        .andExpect(jsonPath(ipPath, is("1.2.3.4")))
        .andExpect(jsonPath(subnetPath, is("/32")))
        .andExpect(jsonPath(descriptionPath, is("Test Network Object für Integrationtest")));
    }

    @Test
    @Order(3)
    public void testGetNetworkObjectById() throws Exception{
        List<NetworkObject> allNo = networkObjectRepository.findAll();
        String id = "";
        for (NetworkObject networkObject : allNo) {
            if (networkObject.getName().equals("Integrationtest v1.0")) {
                id = networkObject.getId();
            }
        }

        mvc.perform(get("/api/network-object/{id}", id))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name", is("Integrationtest v1.0")))
        .andExpect(jsonPath("$.ip", is("1.2.3.4")))
        .andExpect(jsonPath("$.subnet", is("/32")))
        .andExpect(jsonPath("$.description", is("Test Network Object für Integrationtest")));
    }

    @Test
    @Order(4)
    public void testGetContextByIdWithError() throws Exception{
        String id = "empty";
        mvc.perform(get("/api/network-object/{id}", id))
        .andExpect(status().isNotFound());

    }

    @Test
    @Order(5)
    public void testPutContext() throws Exception {
        List<NetworkObject> allNo = networkObjectRepository.findAll();
        String id = "";
        for (NetworkObject networkObject : allNo) {
            if (networkObject.getName().equals("Integrationtest v1.0")) {
                id = networkObject.getId();
            }
        }

    NetworkObjectEditDTO noDTO = new NetworkObjectEditDTO(id, "Integrationtest v2.0", "1.2.3.4", "/32", "Test Network Object für Integrationtest PUT TEST");
    ObjectMapper mapper = new ObjectMapper();
    mvc.perform(put("/api/network-object")
    .contentType("application/json")
    .content(mapper.writeValueAsBytes(noDTO)))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.name", is("Integrationtest v2.0")))
    .andExpect(jsonPath("$.ip", is("1.2.3.4")))
    .andExpect(jsonPath("$.subnet", is("/32")))
    .andExpect(jsonPath("$.description", is("Test Network Object für Integrationtest PUT TEST")));
    }

    @Test
    @Order(6)
    public void testDeleteUseCase() throws Exception {
        List<NetworkObject> allNo = networkObjectRepository.findAll();
        String id = "";
        for (NetworkObject networkObject : allNo) {
            if (networkObject.getName().equals("Integrationtest v2.0")) {
                id = networkObject.getId();
            }
        }
        mvc.perform(delete("/api/network-object/{id}", id))
        .andExpect(status().isOk());
    }

    
}
