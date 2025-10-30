package org.spaceappschallenge.y2025.pear_up_api.service;

import java.net.URI;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.spaceappschallenge.y2025.pear_up_api.dto.CategoryDto.ActivityResDto;
import org.spaceappschallenge.y2025.pear_up_api.dto.ChartJsBarDto;
import org.spaceappschallenge.y2025.pear_up_api.dto.ChartJsBarDto.ChartJsBarDataDto;
import org.spaceappschallenge.y2025.pear_up_api.dto.IndexDto.AnalyzeWeatherRiskForSelectedActivitiesReqDto;
import org.spaceappschallenge.y2025.pear_up_api.dto.IndexDto.AnalyzeWeatherRiskForSelectedActivitiesResDto;
import org.spaceappschallenge.y2025.pear_up_api.dto.IndexDto.PersonalizedTipsAdviceResDto;
import org.spaceappschallenge.y2025.pear_up_api.dto.IndexDto.VietnamWeatherTrendsReqDto;
import org.spaceappschallenge.y2025.pear_up_api.dto.IndexDto.WeatherResDto;
import org.spaceappschallenge.y2025.pear_up_api.dto.PowerLarcNasaGovApiDto.TemporalDailyPointReqDto;
import org.spaceappschallenge.y2025.pear_up_api.dto.PowerLarcNasaGovApiDto.TemporalDailyPointResDto;
import org.spaceappschallenge.y2025.pear_up_api.util.DateEx;
import org.spaceappschallenge.y2025.pear_up_api.util.EnumActivity;
import org.spaceappschallenge.y2025.pear_up_api.util.EnumDateType;
import org.spaceappschallenge.y2025.pear_up_api.util.PowerLarcNasaGovApiUtil.EnumParameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.collect.Lists;

import lombok.extern.slf4j.Slf4j;

/**
 * @author ThangNM
 */

@Slf4j
@Service
public class IndexService {

	private static final Cache<String, ChartJsBarDto> CACHE_INDEX_GET_VIETNAM_WEATHER_TRENDS //
			= CacheBuilder.newBuilder() //
					.maximumSize(1000) // Tối đa 100 phần tử trong cache
					.expireAfterWrite(3, TimeUnit.MINUTES) // Hết hạn sau 3 phút
					.build();

	private static final Cache<String, AnalyzeWeatherRiskForSelectedActivitiesResDto> CACHE_INDEX_GET_ANALYZE__WEATHER_RISK_FOR_SELECTED_ACTIVITIES //
			= CacheBuilder.newBuilder() //
					.maximumSize(1000) // Tối đa 100 phần tử trong cache
					.expireAfterWrite(3, TimeUnit.MINUTES) // Hết hạn sau 3 phút
					.build();

	@Value("${app.restapi.api-url-power-larc-nasa-gov}")
	private String appRestapiApiUrlPowerLarcNasaGov;

	@Autowired
	private CategoryService categoryService;

	public ChartJsBarDto getVietnamWeatherTrends( //
			VietnamWeatherTrendsReqDto objInput //
	) {
		ChartJsBarDto objRet = CACHE_INDEX_GET_VIETNAM_WEATHER_TRENDS.getIfPresent(objInput.toString());
		if (objRet != null) {
			return objRet;
		}

		Calendar calendarYearOld = Calendar.getInstance();
		calendarYearOld.setTime(new Date());
		String replaceYearNew = Integer.toString(calendarYearOld.get(Calendar.YEAR));
		calendarYearOld.add(Calendar.YEAR, -1);
		String replaceYearOld = Integer.toString(calendarYearOld.get(Calendar.YEAR));

		TemporalDailyPointReqDto objTdprd = new TemporalDailyPointReqDto();
		objTdprd.setLatitude(objInput.getLatitude());
		objTdprd.setLongitude(objInput.getLongitude());
		objTdprd.setStart(DateEx.date2Vn(calendarYearOld.getTime(), DateEx.YYYYMMDD));
		objTdprd.setEnd(this.getDateEndAsString(calendarYearOld.getTime(), objInput.getEnumDateType(), true));
		objRet = this.getChartJsBarDtoAll( //
				objTdprd //
				, replaceYearOld //
				, replaceYearNew //
		);

		CACHE_INDEX_GET_VIETNAM_WEATHER_TRENDS.put(objInput.toString(), objRet);
		return objRet;
	}

	public AnalyzeWeatherRiskForSelectedActivitiesResDto getAnalyzeWeatherRiskForSelectedActivities( //
			AnalyzeWeatherRiskForSelectedActivitiesReqDto objInput //
	) {
		AnalyzeWeatherRiskForSelectedActivitiesResDto objRet = CACHE_INDEX_GET_ANALYZE__WEATHER_RISK_FOR_SELECTED_ACTIVITIES
				.getIfPresent(objInput.toString());
		if (objRet != null) {
			return objRet;
		}
		objRet = new AnalyzeWeatherRiskForSelectedActivitiesResDto();

		// get DD/MM/YYYY (YYYY - 1)
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		calendar.add(Calendar.YEAR, -1);
		TemporalDailyPointReqDto objTdprd = new TemporalDailyPointReqDto();
		objTdprd.setLatitude(objInput.getLatitude());
		objTdprd.setLongitude(objInput.getLongitude());
		objTdprd.setStart(DateEx.date2Vn(calendar.getTime(), DateEx.YYYYMMDD));
		objTdprd.setEnd(objTdprd.getStart());

		TemporalDailyPointResDto objRes = this.callApiPowerLarcNasaGov(objTdprd, TemporalDailyPointResDto.class);
		Map<String, WeatherResDto> mapWeatherSelection = new HashMap<>();
		mapWeatherSelection.put(EnumParameter.T2M.getLabel(), this.getParameterIndex0(objRes, EnumParameter.T2M));
		mapWeatherSelection.put(EnumParameter.RH2M.getLabel(), this.getParameterIndex0(objRes, EnumParameter.RH2M));
		mapWeatherSelection.put(EnumParameter.WS2M.getLabel(), this.getParameterIndex0(objRes, EnumParameter.WS2M));
		mapWeatherSelection.put(EnumParameter.PRECTOTCORR.getLabel(),
				this.getParameterIndex0(objRes, EnumParameter.PRECTOTCORR));
		objRet.setMapWeatherSelection(mapWeatherSelection);

		// get DD/MM/YYYY (YYYY 5 year)
		Map<String, ChartJsBarDto> mapWeatherAi = new HashMap<>();
		objTdprd = new TemporalDailyPointReqDto();
		objTdprd.setLatitude(objInput.getLatitude());
		objTdprd.setLongitude(objInput.getLongitude());

		ChartJsBarDto objDes = this.getChartJsBarDtoAllV2(objTdprd, new Date(), Calendar.YEAR, -5);
		for (int i = 4; i > 0; i--) {
			this.getChartJsBarDtoMerge(objDes, this.getChartJsBarDtoAllV2(objTdprd, new Date(), Calendar.YEAR, 0 - i));
		}
		mapWeatherAi.put("5 year", objDes);
		objRet.setMapWeatherAi(mapWeatherAi);

		PersonalizedTipsAdviceResDto objActivity;
		for (EnumActivity e : objInput.getArrEnumActivity()) {
			objActivity = new PersonalizedTipsAdviceResDto();
			objActivity.setActivity(e.name());
			objActivity.setScore(this.calScore(e, objRet));
			objActivity.setNote(this.convertScore2PersonalizedTipsAdvice(e, objActivity.getScore()));
			objRet.getLstPersonalizedTipsAdviceResDto().add(objActivity);
		}

		CACHE_INDEX_GET_ANALYZE__WEATHER_RISK_FOR_SELECTED_ACTIVITIES.put(objInput.toString(), objRet);
		return objRet;
	}

	// ===============

	private <T> T callApiPowerLarcNasaGov(TemporalDailyPointReqDto objInput, Class<T> responseType) {
		String uriString = null;
		try {
			URI uri = UriComponentsBuilder //
					.fromUriString(String.format("%s/temporal/daily/point", this.appRestapiApiUrlPowerLarcNasaGov)) //
					.queryParam("start", objInput.getStart()) // "20250901"
					.queryParam("end", objInput.getEnd()) // "20250930"
					.queryParam("latitude", objInput.getLatitude()) // "21.000420"
					.queryParam("longitude", objInput.getLongitude()) // "105.889607"
					.queryParam("community", "ag") //
					.queryParam("parameters", this.getParameters()) //
					.queryParam("format", "json") //
					.queryParam("units", "metric") //
					.queryParam("header", "true") //
					.build() //
					.encode() //
					.toUri();
			uriString = uri.toString();
			log.info("RestTemplate > Request: [{}]", uriString);

			RestTemplate restTemplate = new RestTemplate();
			return restTemplate.getForObject(uri, responseType);
		} catch (Exception e) {
			throw new RuntimeException(String.format("Call api [%s] error. %s", uriString, e.getMessage()), e);
		}
	}

	private String getParameters() {
		return String.join(",", Lists.newArrayList( //
				EnumParameter.T2M.name() //
				, EnumParameter.RH2M.name() //
				, EnumParameter.WS2M.name() //
				, EnumParameter.PRECTOTCORR.name() //
		));
	}

	private String getDateEndAsString(Date dateStart, EnumDateType enumDateType, boolean isFuture) {
		int amount;
		if (isFuture) {
			amount = enumDateType.getDay();
		} else {
			amount = 0 - enumDateType.getDay();
		}
		return this.getDateEndAsString(dateStart, Calendar.DAY_OF_MONTH, amount);
	}

	private String getDateEndAsString(Date dateStart, int field, int amount) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(dateStart);
		calendar.add(field, amount);
		Date dateEnd = calendar.getTime();
		return DateEx.date2Vn(dateEnd, DateEx.YYYYMMDD);
	}

	private ChartJsBarDto getChartJsBarDtoAll(TemporalDailyPointReqDto objTdprd, String replaceYearOld,
			String replaceYearNew) {
		ChartJsBarDto objRet = new ChartJsBarDto();
		TemporalDailyPointResDto objRes = this.callApiPowerLarcNasaGov(objTdprd, TemporalDailyPointResDto.class);
		if (objRes != null && objRes.getProperties() != null && objRes.getProperties().getParameter() != null) {
			List<ChartJsBarDataDto> datasets = new ArrayList<>();
			datasets.add(this.getChartJsBarDataDto(objRes, EnumParameter.T2M, objRet, replaceYearOld, replaceYearNew));
			datasets.add(this.getChartJsBarDataDto(objRes, EnumParameter.RH2M, objRet, replaceYearOld, replaceYearNew));
			datasets.add(this.getChartJsBarDataDto(objRes, EnumParameter.WS2M, objRet, replaceYearOld, replaceYearNew));
			datasets.add(this.getChartJsBarDataDto(objRes, EnumParameter.PRECTOTCORR, objRet, replaceYearOld,
					replaceYearNew));
			objRet.setDatasets(datasets);
		}
		return objRet;
	}

	private ChartJsBarDto getChartJsBarDtoAllV2(TemporalDailyPointReqDto objTdprd, Date dateStart, int field,
			int amount) {
		objTdprd.setStart(this.getDateEndAsString(dateStart, field, amount));
		objTdprd.setEnd(objTdprd.getStart());
		return this.getChartJsBarDtoAll(objTdprd, null, null);
	}

	private ChartJsBarDto getChartJsBarDtoMerge(ChartJsBarDto objDes, ChartJsBarDto objSrc) {
		objDes.getLabels().addAll(objSrc.getLabels());
		for (int i = 0; i < objDes.getDatasets().size(); i++) {
			objDes.getDatasets().get(i).getData().addAll(objSrc.getDatasets().get(i).getData());
		}
		return objDes;
	}

	private ChartJsBarDataDto getChartJsBarDataDto(TemporalDailyPointResDto objInput, EnumParameter enumParameter,
			ChartJsBarDto objChartJsBarDto, String replaceYearOld, String replaceYearNew) {
		ChartJsBarDataDto objRet = new ChartJsBarDataDto();
		Map<String, String> mapT2M = objInput.getProperties().getParameter().get(enumParameter.name());
		if (mapT2M != null) {
			objChartJsBarDto.setLabels(this.getLabels(mapT2M, replaceYearOld, replaceYearNew));
			for (Map.Entry<String, String> entry : mapT2M.entrySet()) {
				if ("-999.0".equals(entry.getValue())) {
					entry.setValue(null);
				}
			}
			objRet.setLabel(enumParameter.getLabel());
			objRet.setData(new ArrayList<>(mapT2M.values()));
		}
		return objRet;
	}

	private List<String> getLabels(Map<String, String> mapT2M, String replaceYearOld, String replaceYearNew) {
		List<String> lstRet = new ArrayList<>();
		String label;
		for (Map.Entry<String, String> entry : mapT2M.entrySet()) {
			label = entry.getKey();
			if (!StringUtils.isBlank(replaceYearOld) && !StringUtils.isBlank(replaceYearNew)) {
				label = label.replace(replaceYearOld, replaceYearNew);
			}
			lstRet.add(label);
		}
		return lstRet;
	}

	private WeatherResDto getParameterIndex0(TemporalDailyPointResDto objInput, EnumParameter enumParameter) {
		WeatherResDto objRet = new WeatherResDto();
		if (objInput == null //
				|| objInput.getProperties() == null //
				|| objInput.getProperties().getParameter() == null //
				|| objInput.getProperties().getParameter().get(enumParameter.name()) == null //
		) {
			return objRet;
		}

		objRet.setParam(
				objInput.getProperties().getParameter().get(enumParameter.name()).values().stream().toList().get(0));
		Double param = Double.parseDouble(objRet.getParam());
		if ("-999.0".equals(objRet.getParam())) {
			objRet.setParam(null);
			objRet.setLevel("N/A");
			return objRet;
		}

		String level = "N/A";
		switch (enumParameter) {
		case T2M:
			if (param < 20) {
				level = "LOW";
			} else if (param >= 20 && param < 30) {
				level = "MID";
			} else if (param > 30) {
				level = "HIGH";
			}
			break;

		case RH2M:
			if (param < 50) {
				level = "LOW";
			} else if (param >= 50 && param < 80) {
				level = "MID";
			} else if (param > 80) {
				level = "HIGH";
			}
			break;

		case WS2M:
			if (param < 5) {
				level = "LOW";
			} else if (param >= 5 && param < 20) {
				level = "MID";
			} else if (param > 20) {
				level = "HIGH";
			}
			break;

		case PRECTOTCORR:
			if (param < 30) {
				level = "LOW";
			} else if (param >= 30 && param < 80) {
				level = "MID";
			} else if (param > 80) {
				level = "HIGH";
			}
			break;

		}
		objRet.setLevel(level);
		return objRet;
	}

	private Integer calScore(EnumActivity enumActivity, AnalyzeWeatherRiskForSelectedActivitiesResDto objRet) {
		Integer score = ThreadLocalRandom.current().nextInt(0, 101);
		return score;
	}

	private String convertScore2PersonalizedTipsAdvice(EnumActivity enumActivity, Integer score) {
		if (score == null) {
			return "N/A";
		}
		String level = "N/A";
		if (score < 40) {
			level = "low";
		}
		if (score >= 40 && score < 70) {
			level = "moderate";
		}
		if (score >= 70) {
			level = "high";
		}

		List<ActivityResDto> lstActivityResDto = this.categoryService.getListActivity();
		Map<String, ActivityResDto> mapActivityResDto = lstActivityResDto.stream()
				.collect(Collectors.toMap(ActivityResDto::getCode, dto -> dto));
		if (mapActivityResDto != null) {
			ActivityResDto objTemp = mapActivityResDto.get(enumActivity.name().toLowerCase());
			if (objTemp != null) {
				level = objTemp.getRecommend().get(level);
			}
		}

		return level;
	}

}
