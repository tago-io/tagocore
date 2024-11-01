import { Chart } from "@antv/g2";
import type { IStatistic } from "@tago-io/tcore-sdk/types";
import { Interval } from "luxon";
import { useEffect, useRef } from "react";
import { useTheme } from "styled-components";
import Loading from "../../Loading/Loading.tsx";
import * as Style from "./RequestChart.style";

/**
 * Props.
 */
interface IResourceHistoryChart {
  /**
   * Unique identifier for this chart.
   */
  id: string;
  /**
   * Values.
   */
  statistics: IStatistic[] | null;
  /**
   * Property to use.
   */
  type: "input" | "output";
}

/**
 * Usage statistic history chart.
 */
function ResourceHistoryChart(props: IResourceHistoryChart) {
  const id = `resource-history-chart-${props.id}`;
  const theme = useTheme();
  const chart = useRef<Chart>();

  const { statistics, type } = props;

  /**
   * Gets the tooltip template.
   */
  const getTooltipTemplate = () => {
    return `
      <div class="tooltip-container">
        <div class="tooltip-content">
          <b>{value}</b> {description}
        </div>

        <div class="tooltip-warning" style="display: {lastStyle}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            <!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) -->
            <path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"/>
          </svg>
          <span> In progress</span>
        </div>
      </div>
    `;
  };

  /**
   * Runs when the data arrives and creates the chart.
   */
  useEffect(() => {
    chart.current = new Chart({
      autoFit: true,
      container: id,
    });

    chart.current.legend(false); // hides the legend
    chart.current.axis("value", false); // hides the y-axis

    // sets the tooltip info
    chart.current.tooltip({
      itemTpl: getTooltipTemplate(),
      showCrosshairs: true,
      showTitle: false,
      domStyles: {
        "g2-tooltip": { padding: 0 }, // Remove horizontal padding
        "g2-tooltip-title": { display: "none" }, // Remove top padding
      },
    });

    // make the x-axis start in 0 and end at the very end of the chart.current
    chart.current.scale("time", {
      range: [0, 1],
    });

    // formats the time according to the settings of the user
    chart.current.axis("time", {
      label: {
        autoRotate: false,
      },
    });

    chart.current.animate(false);

    // shows the actual line:
    chart.current
      .line()
      .position("time*value")
      .color(theme.home)
      .shape("line")
      .tooltip({
        callback: (description, value, time, lastStyle) => ({
          description,
          time,
          value,
          lastStyle,
        }),
        fields: ["description", "value", "time", "lastStyle"],
      })
      .animate({
        appear: false,
        enter: false,
        leave: false,
      })
      .label({
        callback: (value) => ({
          content: value || "",
        }),
        fields: ["value"],
      });

    // shows dots at every point in the data
    chart.current
      .point()
      .position("time*value")
      .color({
        callback: (last) => (last ? theme.buttonWarning : theme.buttonPrimary),
        fields: ["last"],
      })
      .shape("circle")
      .tooltip(false)
      .animate({
        appear: false,
        enter: false,
        leave: false,
      });

    // renders the modifications
    chart.current.render();

    return () => {
      chart.current?.destroy();
    };
  }, [id, theme]);

  /**
   */
  useEffect(() => {
    const data = [];
    const now = new Date();
    let maximum = 0;

    for (let i = 0; i <= 15; i++) {
      const p = statistics?.find((x) => {
        const diff = Math.floor(
          Interval.fromDateTimes(new Date(x.time), now).length("minute"),
        );
        return i === diff;
      });

      const time = i === 0 ? "Now" : `${i}m`;
      const value = p?.[type] || 0;
      const last = i === 0;

      maximum = Math.max(maximum, value);

      let description = value === 1 ? `${type}` : `${type}s`;
      if (i === 0) {
        description += " so far";
      } else {
        description += ` ${time} ago`;
      }

      data.unshift({
        time,
        value,
        description,
        lastStyle: last ? "flex" : "none",
        last,
      });
    }

    chart.current?.scale({
      value: {
        min: 0,
        max: maximum * 1.2,
      },
    });

    chart.current?.changeData(data);
    chart.current?.render(true);
  }, [type, statistics]);

  return (
    <>
      {!statistics && <Loading />}
      {<Style.Container visible={!!statistics} id={id} />}
    </>
  );
}

export default ResourceHistoryChart;
