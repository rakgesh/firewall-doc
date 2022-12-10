package ch.buelach.firewalldoc;

import static org.hamcrest.core.Is.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
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

import ch.buelach.firewalldoc.model.NetworkGroupObject;
import ch.buelach.firewalldoc.model.NetworkGroupObjectCreateDTO;
import ch.buelach.firewalldoc.model.NetworkGroupObjectEditDTO;
import ch.buelach.firewalldoc.repository.NetworkGroupObjectRepository;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(OrderAnnotation.class)
public class NetworkGroupObjectControllerTest {
    @Autowired
    private MockMvc mvc;
    @Autowired
    private NetworkGroupObjectRepository networkGroupObjectRepository;

    @Test
    @Order(1)
    public void testPostNewNetworkGroupObject() throws Exception {
        List<String> testMembers = new ArrayList<String>();
        testMembers.add("TEST");
        testMembers.add("Test");
        NetworkGroupObjectCreateDTO ngoDTO = new NetworkGroupObjectCreateDTO("Integrationtest v1.0",
                "Test Network Group Object für Integrationtest", testMembers);
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(post("/api/network-group-object")
                .contentType("application/json")
                .content(mapper.writeValueAsBytes(ngoDTO)))
                .andExpect(status().isCreated());
    }

    @Test
    @Order(2)
    public void testGetAllNetworkGroupObjects() throws Exception {
        int i = networkGroupObjectRepository.findAll().size() - 1;
        String namePath = "$.[" + i + "].name";
        String descriptionPath = "$.[" + i + "].description";
        String membersPath = "$.[" + i + "].membersId";
        String members0Path = membersPath + "[0]";
        String members1Path = membersPath + "[1]";

        mvc.perform(get("/api/network-group-object"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(namePath, is("Integrationtest v1.0")))
                .andExpect(jsonPath(descriptionPath, is("Test Network Group Object für Integrationtest")))
                .andExpect(jsonPath(membersPath).isArray())
                .andExpect(jsonPath(members0Path, is("TEST")))
                .andExpect(jsonPath(members1Path, is("Test")));
    }

    @Test
    @Order(3)
    public void testGetNetworkGroupObjectById() throws Exception {
        List<NetworkGroupObject> allNGO = networkGroupObjectRepository.findAll();
        String id = "";
        for (NetworkGroupObject networkGroupObject : allNGO) {
            if (networkGroupObject.getName().equals("Integrationtest v1.0")) {
                id = networkGroupObject.getId();
            }
        }
        mvc.perform(get("/api/network-group-object/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Integrationtest v1.0")))
                .andExpect(jsonPath("$.description", is("Test Network Group Object für Integrationtest")))
                .andExpect(jsonPath("$.membersId").isArray())
                .andExpect(jsonPath("$.membersId[0]", is("TEST")))
                .andExpect(jsonPath("$.membersId[1]", is("Test")));
    }

    @Test
    @Order(4)
    public void testGetNetworkGroupObjectByIdWithError() throws Exception {
        String id = "empty";
        mvc.perform(get("/api/network-group-object/{id}", id))
                .andExpect(status().isNotFound());

    }

    @Test
    @Order(5)
    public void testPutNetworkGroupObject() throws Exception {
        List<NetworkGroupObject> allNGO = networkGroupObjectRepository.findAll();
        String id = "";
        for (NetworkGroupObject networkGroupObject : allNGO) {
            if (networkGroupObject.getName().equals("Integrationtest v1.0")) {
                id = networkGroupObject.getId();
            }
        }
        List<String> testMembers = new ArrayList<String>();
        testMembers.add("TEST");
        testMembers.add("Test");
        NetworkGroupObjectEditDTO ngoEDTO = new NetworkGroupObjectEditDTO(id, "Integrationtest v2.0",
                "Test Network Group Object für Integrationtest nach PUT TEST", testMembers);
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(put("/api/network-group-object")
                .contentType("application/json")
                .content(mapper.writeValueAsBytes(ngoEDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Integrationtest v2.0")))
                .andExpect(jsonPath("$.description", is("Test Network Group Object für Integrationtest nach PUT TEST")))
                .andExpect(jsonPath("$.membersId").isArray())
                .andExpect(jsonPath("$.membersId[0]", is("TEST")))
                .andExpect(jsonPath("$.membersId[1]", is("Test")));
    }

    @Test
    @Order(6)
    public void testDeleteNetworkGroupObject() throws Exception {
        List<NetworkGroupObject> allNGO = networkGroupObjectRepository.findAll();
        String id = "";
        for (NetworkGroupObject networkGroupObject : allNGO) {
            if (networkGroupObject.getName().equals("Integrationtest v2.0")) {
                id = networkGroupObject.getId();
            }
        }
        mvc.perform(delete("/api/network-group-object/{id}", id))
                .andExpect(status().isOk());
    }
}
