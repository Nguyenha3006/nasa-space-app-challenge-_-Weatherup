package org.spaceappschallenge.y2025.pear_up_api.webapi;

import org.spaceappschallenge.y2025.pear_up_api.dto.ChartJsBarDto;
import org.spaceappschallenge.y2025.pear_up_api.dto.IndexDto.AnalyzeWeatherRiskForSelectedActivitiesReqDto;
import org.spaceappschallenge.y2025.pear_up_api.dto.IndexDto.AnalyzeWeatherRiskForSelectedActivitiesResDto;
import org.spaceappschallenge.y2025.pear_up_api.dto.IndexDto.VietnamWeatherTrendsReqDto;
import org.spaceappschallenge.y2025.pear_up_api.service.IndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.WebApplicationContext;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * @author ThangNM
 */

@CrossOrigin(origins = "*", allowCredentials = "false")
@Tag(name = "Trang chủ", description = "")
@RestController
@RequestMapping(value = "/v1/index")
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class IndexRestController {

	@Autowired
	private IndexService indexService;

	@Operation(summary = "Vietnam Weather Trends", description = "")
	@GetMapping("get_vietnam_weather_trends")
	public ResponseEntity<ChartJsBarDto> getVietnamWeatherTrends( //
			@Valid @ModelAttribute VietnamWeatherTrendsReqDto objInput //
	) {
		return ResponseEntity.ok(this.indexService.getVietnamWeatherTrends( //
				objInput //
		));
	}

	@Operation(summary = "Analyze Weather Risk for Selected Activities", description = "")
	@GetMapping("get_analyze_weather_risk_for_selected_activities")
	public ResponseEntity<AnalyzeWeatherRiskForSelectedActivitiesResDto> getAnalyzeWeatherRiskForSelectedActivities( //
			@Valid @ModelAttribute AnalyzeWeatherRiskForSelectedActivitiesReqDto objInput //
	) {
		return ResponseEntity.ok(this.indexService.getAnalyzeWeatherRiskForSelectedActivities( //
				objInput //
		));
	}

}
