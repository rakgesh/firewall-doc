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

import ch.buelach.firewalldoc.model.Context;
import ch.buelach.firewalldoc.model.ContextCreateDTO;
import ch.buelach.firewalldoc.model.ContextEditDTO;
import ch.buelach.firewalldoc.repository.ContextRepository;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(OrderAnnotation.class)
public class ContextControllerTest {
    @Autowired
    private MockMvc mvc;
    @Autowired
    private ContextRepository contextRepository;

    private String token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1yOGR4OGJ6TDZCUWZUWlZOTVBmSCJ9.eyJ1c2VyX3JvbGVzIjpbImFkbWluIl0sIm5pY2tuYW1lIjoidGVzdCIsIm5hbWUiOiJ0ZXN0QHRlc3QuY2giLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvMGIyYWM2OWMyMTA1YzRmOTE0MTUzNWY3YWM4OTVkOWU_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZ0ZS5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyMi0xMi0xN1QxNDo1MjowMC44NzBaIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY2giLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOi8vZGV2LTBhdWZqbmhjYmRqbG10NjIudXMuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDYzODY0MTA2YzBmOGFhYmZmNjRhOWQ4NiIsImF1ZCI6IkFHRUxyN2I0TzJSaHdVdDQwT2V2eWZrcDNQNTY4RDZIIiwiaWF0IjoxNjcxMjg4NzIyLCJleHAiOjE2NzM4ODA3MjIsInNpZCI6IlJWVFBDWHJrNVhhT29uc1dvMWJRbDFiVWh6NWh6Q1dRIiwibm9uY2UiOiJOa0ZSWm1JMFpVNWxla0ZvY0ZBNGZtUjRRekZZVVZSdFQyTkRaa1pDY2pWakxtMDFRV1ZOV2s1SVl3PT0ifQ.V37VjRAE-Gt18aESQBezcyf9mM6qvLrIESBjoYE3mq-QrdaImPJ3jdsghB5PXuYy6ZSWpshb5VaBn3rfHzioxjDdQboxs0xiv7TuU4QiRecwMVuPsY8qeFp0053ad7WGhFYXqmF7KjGhhmqyAcjR8MafyrNrGH6NhrycSeAgZimvmWh8yfqpM2D5YK1GVpF9ZWVBdv_aKOS9Vd73ZY8pFlrZtlJb5IVqMXjifVtTZ1vwXcPz42TI6lqcB4xSyt8I8HXG_tuA4BeT_6GsEe6xYfTPJyuDPYj_NlSouoYs5Ipfu9ACEGx5ZwCfPocI4kvhRQoypU_vBMPRvoEgPJgX2w";

    @Test
    @Order(1)
    public void testPostNewContext() throws Exception {
        ContextCreateDTO cDTO = new ContextCreateDTO("Integrationtest v1.0", "1.2.3.4", "/32", "Test Context für Integrationtest");
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(post("/api/context")
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
        .contentType("application/json")
        .content(mapper.writeValueAsBytes(cDTO)))
        .andExpect(status().isCreated());
    }

    @Test
    @Order(2)
    public void testGetAllContexts() throws Exception{
        int i = contextRepository.findAll().size() -1;
        String namePath = "$.[" +i+ "].name";
        String ipPath = "$.[" +i+ "].ip";
        String subnetPath = "$.[" +i+ "].subnet";
        String descriptionPath = "$.[" +i+ "].description";

        mvc.perform(get("/api/context")
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath(namePath, is("Integrationtest v1.0")))
        .andExpect(jsonPath(ipPath, is("1.2.3.4")))
        .andExpect(jsonPath(subnetPath, is("/32")))
        .andExpect(jsonPath(descriptionPath, is("Test Context für Integrationtest")));
    }

    @Test
    @Order(3)
    public void testGetContextById() throws Exception{
        List<Context> allC = contextRepository.findAll();
        String id = "";
        for (Context context : allC) {
            if (context.getName().equals("Integrationtest v1.0")) {
                id = context.getId();
            }
        }

        mvc.perform(get("/api/context/{id}", id)
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name", is("Integrationtest v1.0")))
        .andExpect(jsonPath("$.ip", is("1.2.3.4")))
        .andExpect(jsonPath("$.subnet", is("/32")))
        .andExpect(jsonPath("$.description", is("Test Context für Integrationtest")));
    }

    @Test
    @Order(4)
    public void testGetContextByIdWithError() throws Exception{
        String id = "empty";
        mvc.perform(get("/api/context/{id}", id)
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
        .andExpect(status().isNotFound());

    }

    @Test
    @Order(5)
    public void testPutContext() throws Exception {
        List<Context> allC = contextRepository.findAll();
        String id = "";
        for (Context context : allC) {
            if (context.getName().equals("Integrationtest v1.0")) {
                id = context.getId();
            }
        }

    ContextEditDTO cDTO = new ContextEditDTO(id, "Integrationtest v2.0", "1.2.3.4", "/32", "Test Context für Integrationtest PUT TEST");
    ObjectMapper mapper = new ObjectMapper();
    mvc.perform(put("/api/context")
    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
    .contentType("application/json")
    .content(mapper.writeValueAsBytes(cDTO)))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.name", is("Integrationtest v2.0")))
    .andExpect(jsonPath("$.ip", is("1.2.3.4")))
    .andExpect(jsonPath("$.subnet", is("/32")))
    .andExpect(jsonPath("$.description", is("Test Context für Integrationtest PUT TEST")));
    }

    @Test
    @Order(6)
    public void testDeleteContext() throws Exception {
        List<Context> allC = contextRepository.findAll();
        String id = "";
        for (Context context : allC) {
            if (context.getName().equals("Integrationtest v2.0")) {
                id = context.getId();
            }
        }
        mvc.perform(delete("/api/context/{id}", id)
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
        .andExpect(status().isOk());
    }

}
