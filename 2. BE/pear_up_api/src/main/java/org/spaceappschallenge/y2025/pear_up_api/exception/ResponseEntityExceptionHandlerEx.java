package org.spaceappschallenge.y2025.pear_up_api.exception;

import java.util.Map;

import org.spaceappschallenge.y2025.pear_up_api.util.EtcCustomsUtils;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.error.ErrorAttributeOptions.Include;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@ControllerAdvice
public class ResponseEntityExceptionHandlerEx extends ResponseEntityExceptionHandler {

	@ExceptionHandler({ Exception.class })
	public final ResponseEntity<Object> handleRestException(Exception ex, WebRequest request) {
		log.error(EtcCustomsUtils.getStackTrace(ex));

		DefaultErrorAttributes dea = new DefaultErrorAttributes();
		Map<String, Object> errorAttributes = dea.getErrorAttributes(request, ErrorAttributeOptions
				.of(Include.EXCEPTION, Include.STACK_TRACE, Include.MESSAGE, Include.BINDING_ERRORS));
		return new ResponseEntity<>(errorAttributes, HttpStatus.INTERNAL_SERVER_ERROR);
	}

}
