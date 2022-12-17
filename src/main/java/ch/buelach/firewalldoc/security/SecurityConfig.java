package ch.buelach.firewalldoc.security;

// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
// import org.springframework.security.oauth2.core.OAuth2TokenValidator;
// import org.springframework.security.oauth2.jwt.Jwt;

// import org.springframework.security.oauth2.jwt.JwtDecoder;
// import org.springframework.security.oauth2.jwt.JwtDecoders;
// import org.springframework.security.oauth2.jwt.JwtValidators;
// import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    String issuerUri;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .mvcMatchers("/api/context").authenticated()
                .mvcMatchers("/api/context/*").authenticated()
                .mvcMatchers("/api/firewall-rule").authenticated()
                .mvcMatchers("/api/firewall-rule/6*").authenticated()
                .mvcMatchers("/api/firewall-type").authenticated()
                .mvcMatchers("/api/firewall-type/*").authenticated()
                .mvcMatchers("/api/host-group-object").authenticated()
                .mvcMatchers("/api/host-group-object/*").authenticated()
                .mvcMatchers("/api/host-object").authenticated()
                .mvcMatchers("/api/host-object/*").authenticated()
                .mvcMatchers("/api/network-group-object").authenticated()
                .mvcMatchers("/api/network-group-object/*").authenticated()
                .mvcMatchers("/api/network-object").authenticated()
                .mvcMatchers("/api/network-object/*").authenticated()
                .mvcMatchers("/api/service").authenticated()
                .mvcMatchers("/api/service/*").authenticated()
                .mvcMatchers("/api/service-group-object").authenticated()
                .mvcMatchers("/api/service-group-object/*").authenticated()
                .mvcMatchers("/api/use-case/*").authenticated()
                .mvcMatchers("/api/use-case").permitAll()
                .mvcMatchers("/api/firewall-rule/byFwType").permitAll()
                .and().cors()
                .and().oauth2ResourceServer().jwt();
        return http.build();
    }

}