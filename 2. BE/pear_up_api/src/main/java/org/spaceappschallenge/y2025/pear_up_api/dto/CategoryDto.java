package org.spaceappschallenge.y2025.pear_up_api.dto;

import java.io.Serializable;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

/**
 * @author ThangNM
 */

public class CategoryDto {

	private CategoryDto() {
		// not called
	}

	@Setter
	@Getter
	public static class ProvinceOfVietnamResDto implements Serializable {
		private static final long serialVersionUID = 1L;

		private String code;

		private String name;

		@JsonProperty("name_vi")
		private String nameVi;

		private Double latitude;

		private Double longitude;

		private Double[] bbox;

	}

	@Setter
	@Getter
	public static class ActivityResDto implements Serializable {
		private static final long serialVersionUID = 1L;

		private String code;

		private String name;

		private String icon;

		private String[] affects;

		private Map<String, String> recommend;

	}

	@Setter
	@Getter
	public static class WeatherConditionResDto implements Serializable {
		private static final long serialVersionUID = 1L;

		private String code;

		private String name;

		private String desc;

		private String icon;

		private String color;

	}

}
