package org.spaceappschallenge.y2025.pear_up_api.dto;

import java.io.Serializable;
import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

/**
 * @author ThangNM
 */

public class PowerLarcNasaGovApiDto {

	private PowerLarcNasaGovApiDto() {
		// not called
	}

	@Setter
	@Getter
	public static class TemporalDailyPointReqDto implements Serializable {
		private static final long serialVersionUID = 1L;

		@Schema(description = "Temporal > Start", example = "20250901")
		private String start;

		@Schema(description = "Temporal > End", example = "20250903")
		private String end;

		@Schema(description = "Latitude", example = "21.000420")
		private Double latitude;

		@Schema(description = "Longitude", example = "105.889607")
		private Double longitude;

	}

	@Setter
	@Getter
	public static class TemporalDailyPointResDto implements Serializable {
		private static final long serialVersionUID = 1L;

		private String type;

		private PropertiesDto properties;

		private Map<String, Map<String, String>> parameters;

	}

	@Setter
	@Getter
	public static class PropertiesDto implements Serializable {
		private static final long serialVersionUID = 1L;

		private Map<String, Map<String, String>> parameter;

	}

}
