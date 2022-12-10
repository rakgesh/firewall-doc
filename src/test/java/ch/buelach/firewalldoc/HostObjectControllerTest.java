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

import ch.buelach.firewalldoc.model.HostObject;
import ch.buelach.firewalldoc.model.HostObjectCreateDTO;
import ch.buelach.firewalldoc.model.HostObjectEditDTO;
import ch.buelach.firewalldoc.repository.HostObjectRepository;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(OrderAnnotation.class)
public class HostObjectControllerTest {
    @Autowired
    private MockMvc mvc;
    @Autowired
    private HostObjectRepository hostObjectRepository;


    @Test
    @Order(1)
    public void testPostNewHostObject() throws Exception {
        HostObjectCreateDTO hoDTO = new HostObjectCreateDTO("Integrationtest v1.0", "1.2.3.4", "Test Host Object für Integrationtest");
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(post("/api/host-object")
        .contentType("application/json")
        .content(mapper.writeValueAsBytes(hoDTO)))
        .andExpect(status().isCreated());
    }

    @Test
    @Order(2)
    public void testGetAllHostObjects() throws Exception{
        int i = hostObjectRepository.findAll().size() -1;
        String namePath = "$.[" +i+ "].name";
        String ipPath = "$.[" +i+ "].ip";
        String descriptionPath = "$.[" +i+ "].description";

        mvc.perform(get("/api/host-object"))
        .andExpect(status().isOk())
        .andExpect(jsonPath(namePath, is("Integrationtest v1.0")))
        .andExpect(jsonPath(ipPath, is("1.2.3.4")))
        .andExpect(jsonPath(descriptionPath, is("Test Host Object für Integrationtest")));
    }

    @Test
    @Order(3)
    public void testGetHostObjectById() throws Exception{
        List<HostObject> allHo = hostObjectRepository.findAll();
        String id = "";
        for (HostObject hostObject : allHo) {
            if (hostObject.getName().equals("Integrationtest v1.0")) {
                id = hostObject.getId();
            }
        }

        mvc.perform(get("/api/host-object/{id}", id))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name", is("Integrationtest v1.0")))
        .andExpect(jsonPath("$.ip", is("1.2.3.4")))
        .andExpect(jsonPath("$.description", is("Test Host Object für Integrationtest")));
    }

    @Test
    @Order(4)
    public void testGetHostObjectByIdWithError() throws Exception{
        String id = "empty";
        mvc.perform(get("/api/host-object/{id}", id))
        .andExpect(status().isNotFound());

    }

    @Test
    @Order(5)
    public void testPutHostObject() throws Exception {
        List<HostObject> allHo = hostObjectRepository.findAll();
        String id = "";
        for (HostObject hostObject : allHo) {
            if (hostObject.getName().equals("Integrationtest v1.0")) {
                id = hostObject.getId();
            }
        }

    HostObjectEditDTO hoDTO = new HostObjectEditDTO(id, "Integrationtest v2.0", "1.2.3.4", "Test Host Object für Integrationtest PUT TEST");
    ObjectMapper mapper = new ObjectMapper();
    mvc.perform(put("/api/host-object")
    .contentType("application/json")
    .content(mapper.writeValueAsBytes(hoDTO)))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.name", is("Integrationtest v2.0")))
    .andExpect(jsonPath("$.ip", is("1.2.3.4")))
    .andExpect(jsonPath("$.description", is("Test Host Object für Integrationtest PUT TEST")));
    }

    @Test
    @Order(6)
    public void testDeleteHostObject() throws Exception {
        List<HostObject> allHo = hostObjectRepository.findAll();
        String id = "";
        for (HostObject hostObject : allHo) {
            if (hostObject.getName().equals("Integrationtest v2.0")) {
                id = hostObject.getId();
            }
        }
        mvc.perform(delete("/api/host-object/{id}", id))
        .andExpect(status().isOk());
    }

}

