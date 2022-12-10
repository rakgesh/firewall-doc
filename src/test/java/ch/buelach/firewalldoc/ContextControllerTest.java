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

    @Test
    @Order(1)
    public void testPostNewContext() throws Exception {
        ContextCreateDTO cDTO = new ContextCreateDTO("Integrationtest v1.0", "1.2.3.4", "/32", "Test Context für Integrationtest");
        ObjectMapper mapper = new ObjectMapper();
        mvc.perform(post("/api/context")
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

        mvc.perform(get("/api/context"))
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

        mvc.perform(get("/api/context/{id}", id))
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
        mvc.perform(get("/api/context/{id}", id))
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
    public void testDeleteUseCase() throws Exception {
        List<Context> allC = contextRepository.findAll();
        String id = "";
        for (Context context : allC) {
            if (context.getName().equals("Integrationtest v2.0")) {
                id = context.getId();
            }
        }
        mvc.perform(delete("/api/context/{id}", id))
        .andExpect(status().isOk());
    }

}
