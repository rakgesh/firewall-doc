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

import ch.buelach.firewalldoc.model.HostGroupObject;
import ch.buelach.firewalldoc.model.HostGroupObjectCreateDTO;
import ch.buelach.firewalldoc.model.HostGroupObjectEditDTO;
import ch.buelach.firewalldoc.repository.HostGroupObjectRepository;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(OrderAnnotation.class)
public class HostGroupObjectControllerTest {
    @Autowired
    private MockMvc mvc;
    @Autowired
    private HostGroupObjectRepository hostGroupObjectRepository;

    @Test
    @Order(1)
    public void testPostNewHostGroupObject() throws Exception {
        List<String> testMembers = new ArrayList<String>();
        testMembers.add("TEST");
        testMembers.add("Test");
        HostGroupObjectCreateDTO hgoDTO = new HostGroupObjectCreateDTO("Integrationtest v1.0",
                "Test Host Group Object für Integrationtest", testMembers);
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(post("/api/host-group-object")
                .contentType("application/json")
                .content(mapper.writeValueAsBytes(hgoDTO)))
                .andExpect(status().isCreated());
    }

    @Test
    @Order(2)
    public void testGetAllHostGroupObjects() throws Exception {
        int i = hostGroupObjectRepository.findAll().size() - 1;
        String namePath = "$.[" + i + "].name";
        String descriptionPath = "$.[" + i + "].description";
        String membersPath = "$.[" + i + "].membersId";
        String members0Path = membersPath + "[0]";
        String members1Path = membersPath + "[1]";

        mvc.perform(get("/api/host-group-object"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(namePath, is("Integrationtest v1.0")))
                .andExpect(jsonPath(descriptionPath, is("Test Host Group Object für Integrationtest")))
                .andExpect(jsonPath(membersPath).isArray())
                .andExpect(jsonPath(members0Path, is("TEST")))
                .andExpect(jsonPath(members1Path, is("Test")));
    }

    @Test
    @Order(3)
    public void testGetHostGroupObjectById() throws Exception {
        List<HostGroupObject> allHGO = hostGroupObjectRepository.findAll();
        String id = "";
        for (HostGroupObject hostGroupObject : allHGO) {
            if (hostGroupObject.getName().equals("Integrationtest v1.0")) {
                id = hostGroupObject.getId();
            }
        }
        mvc.perform(get("/api/host-group-object/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Integrationtest v1.0")))
                .andExpect(jsonPath("$.description", is("Test Host Group Object für Integrationtest")))
                .andExpect(jsonPath("$.membersId").isArray())
                .andExpect(jsonPath("$.membersId[0]", is("TEST")))
                .andExpect(jsonPath("$.membersId[1]", is("Test")));
    }

    @Test
    @Order(4)
    public void testGetHostGroupObjectByIdWithError() throws Exception {
        String id = "empty";
        mvc.perform(get("/api/host-group-object/{id}", id))
                .andExpect(status().isNotFound());

    }

    @Test
    @Order(5)
    public void testPutHostGroupObject() throws Exception {
        List<HostGroupObject> allHGO = hostGroupObjectRepository.findAll();
        String id = "";
        for (HostGroupObject hostGroupObject : allHGO) {
            if (hostGroupObject.getName().equals("Integrationtest v1.0")) {
                id = hostGroupObject.getId();
            }
        }
        List<String> testMembers = new ArrayList<String>();
        testMembers.add("TEST");
        testMembers.add("Test");
        HostGroupObjectEditDTO hgoEDTO = new HostGroupObjectEditDTO(id, "Integrationtest v2.0", "Test Host Group Object für Integrationtest nach PUT TEST", testMembers);
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(put("/api/host-group-object")
                .contentType("application/json")
                .content(mapper.writeValueAsBytes(hgoEDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Integrationtest v2.0")))
                .andExpect(jsonPath("$.description", is("Test Host Group Object für Integrationtest nach PUT TEST")))
                .andExpect(jsonPath("$.membersId").isArray())
                .andExpect(jsonPath("$.membersId[0]", is("TEST")))
                .andExpect(jsonPath("$.membersId[1]", is("Test")));
    }

    @Test
    @Order(6)
    public void testDeleteHostGroupObject() throws Exception {
        List<HostGroupObject> allHGO = hostGroupObjectRepository.findAll();
        String id = "";
        for (HostGroupObject hostGroupObject : allHGO) {
            if (hostGroupObject.getName().equals("Integrationtest v2.0")) {
                id = hostGroupObject.getId();
            }
        }
        mvc.perform(delete("/api/host-group-object/{id}", id))
                .andExpect(status().isOk());
    }
}
