package org.spaceappschallenge.y2025.pear_up_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(servers = { //
		@Server(url = "/", description = "PearUp Api > Server local"),
		@Server(url = "/gateway_nasa/pear_up_api", description = "PearUp Api > Server public") //
})
@SpringBootApplication
public class PearUpApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(PearUpApiApplication.class, args);
	}

}
