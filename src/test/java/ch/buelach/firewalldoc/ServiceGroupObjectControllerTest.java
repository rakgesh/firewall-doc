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

import ch.buelach.firewalldoc.model.ServiceGroupObject;
import ch.buelach.firewalldoc.model.ServiceGroupObjectCreateDTO;
import ch.buelach.firewalldoc.model.ServiceGroupObjectEditDTO;
import ch.buelach.firewalldoc.repository.ServiceGroupObjectRepository;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(OrderAnnotation.class)
public class ServiceGroupObjectControllerTest {
    @Autowired
    private MockMvc mvc;
    @Autowired
    private ServiceGroupObjectRepository serviceGroupObjectRepository;
    
    @Test
    @Order(1)
    public void testPostNewServiceGroupObject() throws Exception {
        List<String> testPort = new ArrayList<String>();
        testPort.add("TEST");
        testPort.add("Test");
        ServiceGroupObjectCreateDTO sgoDTO = new ServiceGroupObjectCreateDTO("Integrationtest v1.0", testPort, "Test Service Group Object für Integrationtest");
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(post("/api/service-group-object")
                .contentType("application/json")
                .content(mapper.writeValueAsBytes(sgoDTO)))
                .andExpect(status().isCreated());
    }

    @Test
    @Order(2)
    public void testGetAllServiceGroupObjects() throws Exception {
        int i = serviceGroupObjectRepository.findAll().size() - 1;
        String namePath = "$.[" + i + "].name";
        String descriptionPath = "$.[" + i + "].description";
        String portPath = "$.[" + i + "].port";
        String port0Path = portPath + "[0]";
        String port1Path = portPath + "[1]";

        mvc.perform(get("/api/service-group-object"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(namePath, is("Integrationtest v1.0")))
                .andExpect(jsonPath(descriptionPath, is("Test Service Group Object für Integrationtest")))
                .andExpect(jsonPath(portPath).isArray())
                .andExpect(jsonPath(port0Path, is("TEST")))
                .andExpect(jsonPath(port1Path, is("Test")));
    }

    @Test
    @Order(3)
    public void testGetServiceGroupObjectById() throws Exception {
        List<ServiceGroupObject> allSGO = serviceGroupObjectRepository.findAll();
        String id = "";
        for (ServiceGroupObject serviceGroupObject : allSGO) {
            if (serviceGroupObject.getName().equals("Integrationtest v1.0")) {
                id = serviceGroupObject.getId();
            }
        }
        mvc.perform(get("/api/service-group-object/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Integrationtest v1.0")))
                .andExpect(jsonPath("$.description", is("Test Service Group Object für Integrationtest")))
                .andExpect(jsonPath("$.port").isArray())
                .andExpect(jsonPath("$.port[0]", is("TEST")))
                .andExpect(jsonPath("$.port[1]", is("Test")));
    }

    @Test
    @Order(4)
    public void testGetServiceGroupObjectByIdWithError() throws Exception {
        String id = "empty";
        mvc.perform(get("/api/service-group-object/{id}", id))
                .andExpect(status().isNotFound());

    }

    @Test
    @Order(5)
    public void testPutServiceGroupObject() throws Exception {
        List<String> testPort = new ArrayList<String>();
        testPort.add("TEST");
        testPort.add("Test");
        List<ServiceGroupObject> allSGO = serviceGroupObjectRepository.findAll();
        String id = "";
        for (ServiceGroupObject serviceGroupObject : allSGO) {
            if (serviceGroupObject.getName().equals("Integrationtest v1.0")) {
                id = serviceGroupObject.getId();
            }
        }
        ServiceGroupObjectEditDTO sgoEDTO = new ServiceGroupObjectEditDTO(id, "Integrationtest v2.0", testPort, "Test Service Group Object für Integrationtest nach PUT TEST");
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(put("/api/service-group-object")
                .contentType("application/json")
                .content(mapper.writeValueAsBytes(sgoEDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Integrationtest v2.0")))
                .andExpect(jsonPath("$.description", is("Test Service Group Object für Integrationtest nach PUT TEST")))
                .andExpect(jsonPath("$.port").isArray())
                .andExpect(jsonPath("$.port[0]", is("TEST")))
                .andExpect(jsonPath("$.port[1]", is("Test")));
    }
    

    @Test
    @Order(6)
    public void testDeleteServiceGroupObject() throws Exception {
        List<ServiceGroupObject> allSGO = serviceGroupObjectRepository.findAll();
        String id = "";
        for (ServiceGroupObject serviceGroupObject : allSGO) {
            if (serviceGroupObject.getName().equals("Integrationtest v2.0")) {
                id = serviceGroupObject.getId();
            }
        }
        
        mvc.perform(delete("/api/service-group-object/{id}", id))
                .andExpect(status().isOk());
    }
}
