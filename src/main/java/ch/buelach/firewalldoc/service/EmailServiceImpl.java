package ch.buelach.firewalldoc.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;



@Component
public class EmailServiceImpl {

    @Autowired
    private JavaMailSender emailSender;

    public void sendMessageRequested(String to, String fwId) {

        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setFrom("firewall.doc@gmail.com");
        message.setTo(to); 
        message.setSubject("New firewall rule requested"); 
        message.setText("A new firewall rule has been registered in the documentation. To see the details and to accept or reject the rule, follow the provided link: http://localhost:8080/#/firewall-rule-details/" + fwId);
        emailSender.send(message);
    }

    public void sendMessageEdited(String to, String fwId) {

        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setFrom("firewall.doc@gmail.com");
        message.setTo(to); 
        message.setSubject("A firewall rule has been edited"); 
        message.setText("A firewall rule has been edited in the documentation. To see the details and to accept or reject the rule, follow the provided link: http://localhost:8080/#/firewall-rule-details/" + fwId);
        emailSender.send(message);
    }

    public void sendMessageApproved(String to, String fwId) {

        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setFrom("firewall.doc@gmail.com");
        message.setTo(to); 
        message.setSubject("Your firewall rule has been approved"); 
        message.setText("Your firewall rule http://localhost:8080/#/firewall-rule-details/" + fwId + " has been approved by an admin. Please take the next steps and order the rule in the service portal of netcloud https://netcloud.service-now.com/csm. As soon as you have placed the order, set the state to ordered.");
        emailSender.send(message);
    }
    
    public void sendMessageRejected(String to, String admin, String fwId) {

        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setFrom("firewall.doc@gmail.com");
        message.setTo(to); 
        message.setSubject("Your firewall rule has been rejected"); 
        message.setText("Your firewall rule http://localhost:8080/#/firewall-rule-details/" + fwId + " has been rejected by " + admin);
        emailSender.send(message);
    }
    
    
}