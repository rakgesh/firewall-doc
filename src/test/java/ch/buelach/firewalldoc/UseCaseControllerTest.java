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

import ch.buelach.firewalldoc.model.UseCase;
import ch.buelach.firewalldoc.model.UseCaseCreateDTO;
import ch.buelach.firewalldoc.model.UseCaseEditDTO;
import ch.buelach.firewalldoc.repository.UseCaseRepository;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(OrderAnnotation.class)
public class UseCaseControllerTest {
    @Autowired
    private MockMvc mvc;
    @Autowired
    private UseCaseRepository useCaseRepository;

    private String token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1yOGR4OGJ6TDZCUWZUWlZOTVBmSCJ9.eyJ1c2VyX3JvbGVzIjpbImFkbWluIl0sIm5pY2tuYW1lIjoidGVzdCIsIm5hbWUiOiJ0ZXN0QHRlc3QuY2giLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvMGIyYWM2OWMyMTA1YzRmOTE0MTUzNWY3YWM4OTVkOWU_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZ0ZS5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyMi0xMi0xN1QxNDo1MjowMC44NzBaIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY2giLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOi8vZGV2LTBhdWZqbmhjYmRqbG10NjIudXMuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDYzODY0MTA2YzBmOGFhYmZmNjRhOWQ4NiIsImF1ZCI6IkFHRUxyN2I0TzJSaHdVdDQwT2V2eWZrcDNQNTY4RDZIIiwiaWF0IjoxNjcxMjg4NzIyLCJleHAiOjE2NzM4ODA3MjIsInNpZCI6IlJWVFBDWHJrNVhhT29uc1dvMWJRbDFiVWh6NWh6Q1dRIiwibm9uY2UiOiJOa0ZSWm1JMFpVNWxla0ZvY0ZBNGZtUjRRekZZVVZSdFQyTkRaa1pDY2pWakxtMDFRV1ZOV2s1SVl3PT0ifQ.V37VjRAE-Gt18aESQBezcyf9mM6qvLrIESBjoYE3mq-QrdaImPJ3jdsghB5PXuYy6ZSWpshb5VaBn3rfHzioxjDdQboxs0xiv7TuU4QiRecwMVuPsY8qeFp0053ad7WGhFYXqmF7KjGhhmqyAcjR8MafyrNrGH6NhrycSeAgZimvmWh8yfqpM2D5YK1GVpF9ZWVBdv_aKOS9Vd73ZY8pFlrZtlJb5IVqMXjifVtTZ1vwXcPz42TI6lqcB4xSyt8I8HXG_tuA4BeT_6GsEe6xYfTPJyuDPYj_NlSouoYs5Ipfu9ACEGx5ZwCfPocI4kvhRQoypU_vBMPRvoEgPJgX2w";

    @Test
    @Order(1)
    public void testPostNewUseCase() throws Exception {
        List<String> testTags = new ArrayList<String>();
        testTags.add("TEST");
        testTags.add("Test");
        UseCaseCreateDTO uDTO = new UseCaseCreateDTO("Integrationtest v1.0", "Test Use Case für Integrationtest", testTags);
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(post("/api/use-case")
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
        .contentType("application/json")
        .content(mapper.writeValueAsBytes(uDTO)))
        .andExpect(status().isCreated());
    }

    @Test
    @Order(2)
    public void testGetAllUseCase() throws Exception{
        int i = useCaseRepository.findAll().size() -1;
        String namePath = "$.[" +i+ "].name";
        String descriptionPath = "$.[" +i+ "].description";
        String tagsPath = "$.[" +i+  "].tags";
        String tags0Path = tagsPath+ "[0]";
        String tags1Path = tagsPath+ "[1]";

        mvc.perform(get("/api/use-case"))
        .andExpect(status().isOk())
        .andExpect(jsonPath(namePath, is("Integrationtest v1.0")))
        .andExpect(jsonPath(descriptionPath, is("Test Use Case für Integrationtest")))
        .andExpect(jsonPath(tagsPath).isArray())
        .andExpect(jsonPath(tags0Path, is("TEST")))
        .andExpect(jsonPath(tags1Path, is("Test")));
    }

    @Test
    @Order(3)
    public void testGetUseCaseById() throws Exception{
        List<UseCase> allUC = useCaseRepository.findAll();
        String id = "";
        for (UseCase useCase : allUC) {
            if (useCase.getName().equals("Integrationtest v1.0")) {
                id = useCase.getId();
            }
        }
        mvc.perform(get("/api/use-case/{id}", id)
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name", is("Integrationtest v1.0")))
        .andExpect(jsonPath("$.description", is("Test Use Case für Integrationtest")))
        .andExpect(jsonPath("$.tags").isArray())
        .andExpect(jsonPath("$.tags[0]", is("TEST")))
        .andExpect(jsonPath("$.tags[1]", is("Test")));
    }

    @Test
    @Order(4)
    public void testGetUseCaseByIdWithError() throws Exception{
        String id = "empty";
        mvc.perform(get("/api/use-case/{id}", id)
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
        .andExpect(status().isNotFound());

    }


    @Test
    @Order(5)
    public void testPutUseCase() throws Exception {
        List<UseCase> allUC = useCaseRepository.findAll();
        String id = "";
        for (UseCase useCase : allUC) {
            if (useCase.getName().equals("Integrationtest v1.0")) {
                id = useCase.getId();
            }
        }
        List<String> testTags = new ArrayList<String>();
        testTags.add("TEST");
        testTags.add("Test");
    UseCaseEditDTO uDTO = new UseCaseEditDTO(id, "Integrationtest v2.0", "Test Use Case für Integrationtest nach PUT TEST", testTags);
    ObjectMapper mapper = new ObjectMapper();
    mvc.perform(put("/api/use-case")
    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
    .contentType("application/json")
    .content(mapper.writeValueAsBytes(uDTO)))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.name", is("Integrationtest v2.0")))
        .andExpect(jsonPath("$.description", is("Test Use Case für Integrationtest nach PUT TEST")))
        .andExpect(jsonPath("$.tags").isArray())
        .andExpect(jsonPath("$.tags[0]", is("TEST")))
        .andExpect(jsonPath("$.tags[1]", is("Test")));
    }

    @Test
    @Order(6)
    public void testDeleteUseCase() throws Exception {
        List<UseCase> allUC = useCaseRepository.findAll();
        String id = "";
        for (UseCase useCase : allUC) {
            if (useCase.getName().equals("Integrationtest v2.0")) {
                id = useCase.getId();
            }
        }
        mvc.perform(delete("/api/use-case/{id}", id)
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
        .andExpect(status().isOk());
    }
}
