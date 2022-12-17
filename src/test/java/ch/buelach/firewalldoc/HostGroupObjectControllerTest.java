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
import org.springframework.http.HttpHeaders;
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

    private String token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1yOGR4OGJ6TDZCUWZUWlZOTVBmSCJ9.eyJ1c2VyX3JvbGVzIjpbImFkbWluIl0sIm5pY2tuYW1lIjoidGVzdCIsIm5hbWUiOiJ0ZXN0QHRlc3QuY2giLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvMGIyYWM2OWMyMTA1YzRmOTE0MTUzNWY3YWM4OTVkOWU_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZ0ZS5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyMi0xMi0xN1QxNDo1MjowMC44NzBaIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY2giLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOi8vZGV2LTBhdWZqbmhjYmRqbG10NjIudXMuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDYzODY0MTA2YzBmOGFhYmZmNjRhOWQ4NiIsImF1ZCI6IkFHRUxyN2I0TzJSaHdVdDQwT2V2eWZrcDNQNTY4RDZIIiwiaWF0IjoxNjcxMjg4NzIyLCJleHAiOjE2NzM4ODA3MjIsInNpZCI6IlJWVFBDWHJrNVhhT29uc1dvMWJRbDFiVWh6NWh6Q1dRIiwibm9uY2UiOiJOa0ZSWm1JMFpVNWxla0ZvY0ZBNGZtUjRRekZZVVZSdFQyTkRaa1pDY2pWakxtMDFRV1ZOV2s1SVl3PT0ifQ.V37VjRAE-Gt18aESQBezcyf9mM6qvLrIESBjoYE3mq-QrdaImPJ3jdsghB5PXuYy6ZSWpshb5VaBn3rfHzioxjDdQboxs0xiv7TuU4QiRecwMVuPsY8qeFp0053ad7WGhFYXqmF7KjGhhmqyAcjR8MafyrNrGH6NhrycSeAgZimvmWh8yfqpM2D5YK1GVpF9ZWVBdv_aKOS9Vd73ZY8pFlrZtlJb5IVqMXjifVtTZ1vwXcPz42TI6lqcB4xSyt8I8HXG_tuA4BeT_6GsEe6xYfTPJyuDPYj_NlSouoYs5Ipfu9ACEGx5ZwCfPocI4kvhRQoypU_vBMPRvoEgPJgX2w";

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
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
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

        mvc.perform(get("/api/host-group-object")
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
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
        mvc.perform(get("/api/host-group-object/{id}", id)
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
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
        mvc.perform(get("/api/host-group-object/{id}", id)
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
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
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
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
        mvc.perform(delete("/api/host-group-object/{id}", id)
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk());
    }
}
