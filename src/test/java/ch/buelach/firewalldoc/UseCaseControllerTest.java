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

    @Test
    @Order(1)
    public void testPostNewUseCase() throws Exception {
        List<String> testTags = new ArrayList<String>();
        testTags.add("TEST");
        testTags.add("Test");
        UseCaseCreateDTO uDTO = new UseCaseCreateDTO("Integrationtest v1.0", "Test Use Case für Integrationtest", testTags);
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(post("/api/use-case")
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
        mvc.perform(get("/api/use-case/{id}", id))
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
        mvc.perform(get("/api/use-case/{id}", id))
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
        mvc.perform(delete("/api/use-case/{id}", id))
        .andExpect(status().isOk());
    }
}
