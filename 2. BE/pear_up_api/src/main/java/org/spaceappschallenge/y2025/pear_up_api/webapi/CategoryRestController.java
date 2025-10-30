package org.spaceappschallenge.y2025.pear_up_api.webapi;

import java.util.List;

import org.spaceappschallenge.y2025.pear_up_api.dto.CategoryDto.ActivityResDto;
import org.spaceappschallenge.y2025.pear_up_api.dto.CategoryDto.ProvinceOfVietnamResDto;
import org.spaceappschallenge.y2025.pear_up_api.dto.CategoryDto.WeatherConditionResDto;
import org.spaceappschallenge.y2025.pear_up_api.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.WebApplicationContext;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * @author ThangNM
 */

@CrossOrigin(origins = "*", allowCredentials = "false")
@Tag(name = "Danh mục", description = "")
@RestController
@RequestMapping(value = "/v1/category")
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CategoryRestController {

	@Autowired
	private CategoryService categoryService;

	@Operation(summary = "List > Province of Vietnam", description = "Danh sách > Tỉnh/thành phố của Việt Nam")
	@GetMapping("get_list_province_of_vietnam")
	public ResponseEntity<List<ProvinceOfVietnamResDto>> getListProvinceOfVietnam( //
	) {
		return ResponseEntity.ok(this.categoryService.getListProvinceOfVietnam( //
		));
	}

	@Operation(summary = "List > Activity", description = "Danh sách > Hoạt động")
	@GetMapping("get_list_activity")
	public ResponseEntity<List<ActivityResDto>> getListActivity( //
	) {
		return ResponseEntity.ok(this.categoryService.getListActivity( //
		));
	}

	@Operation(summary = "List > Weather Condition", description = "Danh sách > Điều kiện thời tiết")
	@GetMapping("get_list_weather_condition")
	public ResponseEntity<List<WeatherConditionResDto>> getListWeatherCondition( //
	) {
		return ResponseEntity.ok(this.categoryService.getListWeatherCondition( //
		));
	}

}
