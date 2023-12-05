import useCurrency from "@/Hooks/useCurrency";
import { Card } from "antd";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { isEmpty } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import styles from "../styles.module.less";
import { formatCurrency } from "@/Utils/generic";

interface PieChartProps {
  title: string;
  chartData: any;
}
interface Point {
  series: {
    name: string;
  };
  y: number;
}

const PieChart: React.FC<PieChartProps> = ({ title, chartData }) => {
  const currency = useCurrency();
  const { formatMessage } = useIntl();

  const options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: title,
      align: "left",
    },
    tooltip: {
      formatter: function (this: { point: Point | undefined }) {
        const point = this.point;
        if (point) {
          return `${point.series.name}: <b>${formatCurrency(
            parseFloat(String(point.y)),
            currency
          )}</b>`;
        }
        return "";
      },
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    series: [
      {
        name: "Amount",
        colorByPoint: true,
        data: chartData,
      },
    ],
    credits: {
      enabled: false,
    },
  };

  const noDataMessage = <p>{formatMessage({ id: "generic.noDataFound" })}</p>;

  const isNotFoundData =
    !chartData ||
    isEmpty(chartData) ||
    chartData?.every((element: Array<string | number>) => element[1] === 0);
  return (
    <Card hoverable bodyStyle={{ position: "relative" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
      {isNotFoundData && <div className={styles.noData}>{noDataMessage}</div>}
    </Card>
  );
};

export default PieChart;
