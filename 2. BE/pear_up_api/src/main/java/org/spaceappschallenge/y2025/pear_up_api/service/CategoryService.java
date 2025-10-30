package org.spaceappschallenge.y2025.pear_up_api.service;

import java.util.List;

import org.spaceappschallenge.y2025.pear_up_api.dto.CategoryDto.ActivityResDto;
import org.spaceappschallenge.y2025.pear_up_api.dto.CategoryDto.ProvinceOfVietnamResDto;
import org.spaceappschallenge.y2025.pear_up_api.dto.CategoryDto.WeatherConditionResDto;
import org.spaceappschallenge.y2025.pear_up_api.util.FileEx;
import org.spaceappschallenge.y2025.pear_up_api.util.JacksonEx;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;

/**
 * @author ThangNM
 */

@Service
public class CategoryService {

	public List<ProvinceOfVietnamResDto> getListProvinceOfVietnam( //
	) {
		return this.mockCategoryAsFile( //
				"list_province_of_vietnam.json" //
				, new TypeReference<List<ProvinceOfVietnamResDto>>() {
				} //
		);
	}

	public List<ActivityResDto> getListActivity( //
	) {
		return this.mockCategoryAsFile( //
				"list_activity.json" //
				, new TypeReference<List<ActivityResDto>>() {
				} //
		);
	}

	public List<WeatherConditionResDto> getListWeatherCondition( //
	) {
		return this.mockCategoryAsFile( //
				"list_weather_condition.json" //
				, new TypeReference<List<WeatherConditionResDto>>() {
				} //
		);
	}

	private <T> T mockCategoryAsFile(String fileName, TypeReference<T> typeReference) {
		String fileContent = FileEx.readAllTextInClass(String.format("public/%s", fileName));
		return JacksonEx.getInstance().string2TypeReference(fileContent, typeReference);
	}

}
