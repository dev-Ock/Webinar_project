package kr.onthelive.training;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "kr.onthelive.training")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
