package org.spaceappschallenge.y2025.pear_up_api.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author ThangNM
 */

@NoArgsConstructor
@Data
public class ChartJsBarDto implements Serializable {
	private static final long serialVersionUID = 1L;

	private List<String> labels = new ArrayList<>();

	private List<ChartJsBarDataDto> datasets = new ArrayList<>();

	@JsonIgnore
	// @ApiModelProperty(hidden = true)
	public void pushDatasets(ChartJsBarDataDto objInput) {
		if (this.datasets == null) {
			this.datasets = new ArrayList<>();
		}
		this.datasets.add(objInput);
	}

	@AllArgsConstructor
	@NoArgsConstructor
	@Data
	public static class ChartJsBarDataDto implements Serializable {
		private static final long serialVersionUID = 1L;

		private String label;

		private String backgroundColor;

		private List<String> data = new ArrayList<>();

	}

}
