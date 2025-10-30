package org.spaceappschallenge.y2025.pear_up_api.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.spaceappschallenge.y2025.pear_up_api.util.EnumActivity;
import org.spaceappschallenge.y2025.pear_up_api.util.EnumDateType;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * @author ThangNM
 */

public class IndexDto {

	private IndexDto() {
		// not called
	}

	@Setter
	@Getter
	public static class VietnamWeatherTrendsReqDto implements Serializable {
		private static final long serialVersionUID = 1L;

		@Schema(description = "Province code", example = "01")
		@NotBlank
		private String provinceCode;

		@Schema(description = "Latitude", example = "21.000420")
		@NotNull
		private Double latitude;

		@Schema(description = "Longitude", example = "105.889607")
		@NotNull
		private Double longitude;

		@Schema(description = "EnumDateType", example = "DAY_7")
		@NotNull
		private EnumDateType enumDateType;

		@Override
		public String toString() {
			return String.format("%s___%s___%s___%s" //
					, this.provinceCode == null ? null : this.provinceCode //
					, this.latitude == null ? null : this.latitude.toString() //
					, this.longitude == null ? null : this.longitude.toString() //
					, this.enumDateType == null ? null : this.enumDateType.name() //
			);
		}

	}

	// -------------------------

	@Setter
	@Getter
	public static class AnalyzeWeatherRiskForSelectedActivitiesReqDto implements Serializable {
		private static final long serialVersionUID = 1L;

		@Schema(description = "Array > Activity", example = "HIKING")
		@NotEmpty
		private EnumActivity[] arrEnumActivity;

		@Schema(description = "Latitude", example = "21.000420")
		@NotNull
		private Double latitude;

		@Schema(description = "Longitude", example = "105.889607")
		@NotNull
		private Double longitude;

		@Schema(description = "Date selection", example = "2025/10/05")
		@NotNull
		private Date dateSelection;

		@Override
		public String toString() {
			return String.format("%s___%s___%s___%s" //
					,
					this.arrEnumActivity == null ? null
							: Arrays.stream(this.arrEnumActivity).map(EnumActivity::name)
									.collect(Collectors.joining(",")) //
					, this.latitude == null ? null : this.latitude.toString() //
					, this.longitude == null ? null : this.longitude.toString() //
					, this.dateSelection == null ? null : this.dateSelection.toString() //
			);
		}

	}

	@Setter
	@Getter
	public static class AnalyzeWeatherRiskForSelectedActivitiesResDto implements Serializable {
		private static final long serialVersionUID = 1L;

		private List<PersonalizedTipsAdviceResDto> lstPersonalizedTipsAdviceResDto = new ArrayList<>();

		private Map<String, WeatherResDto> mapWeatherSelection;

		private Map<String, ChartJsBarDto> mapWeatherAi;

	}

	@Setter
	@Getter
	public static class PersonalizedTipsAdviceResDto implements Serializable {
		private static final long serialVersionUID = 1L;

		private String activity;

		private Integer score;

		private String note;

	}

	@Setter
	@Getter
	public static class WeatherResDto implements Serializable {
		private static final long serialVersionUID = 1L;

		private String level;

		private String param;

	}

}
