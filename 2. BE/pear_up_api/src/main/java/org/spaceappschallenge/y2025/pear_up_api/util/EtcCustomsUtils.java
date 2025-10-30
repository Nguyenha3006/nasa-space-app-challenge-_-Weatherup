package org.spaceappschallenge.y2025.pear_up_api.util;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class EtcCustomsUtils {

	private EtcCustomsUtils() {
		// not called
	}

	public static String getStackTrace(Throwable e) {
		StringWriter stringWriter = new StringWriter();
		PrintWriter printWriter = new PrintWriter(stringWriter);
		e.printStackTrace(printWriter);
		printWriter.close();
		try {
			stringWriter.close();
		} catch (IOException ex) {
			log.error(EtcCustomsUtils.getMessageEx(ex));
		}
		return stringWriter.toString();
	}

	public static String getMessageEx(Throwable cause) {
		return cause.getMessage();
	}

}
