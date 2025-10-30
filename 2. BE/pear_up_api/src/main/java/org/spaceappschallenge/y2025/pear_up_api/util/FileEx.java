package org.spaceappschallenge.y2025.pear_up_api.util;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

import org.springframework.core.io.ClassPathResource;

import lombok.SneakyThrows;

/**
 * @author ThangNM
 */

public class FileEx {

	private FileEx() {
		// not called
	}

	@SneakyThrows
	public static String readAllTextInClass(String path) {
		ClassPathResource resource = new ClassPathResource(path);
		try ( //
				InputStream inputStream = resource.getInputStream();
				Scanner scanner = new Scanner(inputStream, StandardCharsets.UTF_8.name()) //
		) {
			StringBuilder result = new StringBuilder();
			while (scanner.hasNextLine()) {
				result.append(scanner.nextLine()).append("\n");
			}
			return result.toString();
		}
	}

}
