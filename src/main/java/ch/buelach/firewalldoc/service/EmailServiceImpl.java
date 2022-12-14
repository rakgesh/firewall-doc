package ch.buelach.firewalldoc.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;



@Component
public class EmailServiceImpl {

    @Autowired
    private JavaMailSender emailSender;

    public void sendSimpleMessage(String to, String subject, String fwId) {

        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setFrom("firewall.doc@gmail.com");
        message.setTo(to); 
        message.setSubject(subject); 
        message.setText("A new firewall rule has been registered in the documentation. To see the details and to accept and order the rule, follow the provided link: http://localhost:8080/api/firewall-rule/" + fwId);
        emailSender.send(message);
    }
}