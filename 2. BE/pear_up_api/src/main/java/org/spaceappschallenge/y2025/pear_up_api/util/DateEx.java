package org.spaceappschallenge.y2025.pear_up_api.util;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang3.StringUtils;

/**
 * @author ThangNM
 */

public class DateEx {
	
	public static final String YYYYMMDD = "yyyyMMdd";

	private DateEx() {
		// not called
	}

	public static String date2Vn(Object date, String pattern) {
		if (date == null) {
			return StringUtils.EMPTY;
		}
		if (date instanceof Date) {
			return new SimpleDateFormat(pattern).format(date);
		} else {
			return date.toString();
		}
	}

}
