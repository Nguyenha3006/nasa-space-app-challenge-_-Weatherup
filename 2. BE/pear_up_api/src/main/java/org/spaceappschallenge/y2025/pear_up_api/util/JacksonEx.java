package org.spaceappschallenge.y2025.pear_up_api.util;

import java.math.BigDecimal;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.introspect.Annotated;
import com.fasterxml.jackson.databind.introspect.JacksonAnnotationIntrospector;

import lombok.SneakyThrows;

/**
 * @author ThangNM
 */

public class JacksonEx {

	private static JacksonEx instance = new JacksonEx();

	public static JacksonEx getInstance() {
		return instance;
	}

	public ObjectMapper getObjectMapper() {
		ObjectMapper omMap = new ObjectMapper();
		omMap.configOverride(BigDecimal.class).setFormat(JsonFormat.Value.forShape(JsonFormat.Shape.STRING));
		omMap.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
		omMap.setAnnotationIntrospector(new JacksonAnnotationIntrospector() {
			private static final long serialVersionUID = 1L;

			@Override
			public Object findFilterId(Annotated a) {
				return null;
			}
		});
		return omMap;
	}

	@SneakyThrows
	public <T> T string2TypeReference(String sInput, TypeReference<T> typeReference) {
		T objRet = null;
		if (!StringUtils.isEmpty(sInput)) {
			objRet = getObjectMapper().readValue(sInput, typeReference);
		}
		return objRet;
	}

}
