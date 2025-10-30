package org.spaceappschallenge.y2025.pear_up_api.util;

import lombok.AllArgsConstructor;
import lombok.Getter;

public class PowerLarcNasaGovApiUtil {

	private PowerLarcNasaGovApiUtil() {
		// not called
	}

	@AllArgsConstructor
	@Getter
	public enum EnumParameter {
		T2M("Temperature", "Temperature at 2 Meters")// 1. Nhiệt độ ở độ cao 2 mét
		, RH2M("Relative Humidity", "Relative Humidity at 2 Meters") // 3. Độ ẩm tương đối ở độ cao 2 mét
		, WS2M("Wind Speed", "Wind Speed at 2 Meters") // 4. Tốc độ gió ở độ cao 2 mét
		, PRECTOTCORR("Precipitation Corrected", "Precipitation Corrected") // 18. Lượng mưa đã hiệu chỉnh

		;

		private String label;

		private String desc;
	}

}
