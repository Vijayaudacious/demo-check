import useCurrency from "@/Hooks/useCurrency";
import { Card } from "antd";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { isEmpty } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import styles from "./styles.module.less";
import { formatCurrency } from "@/Utils/generic";

interface HighchartsProps {
  title: string | React.ReactNode;
  yAxisTitle: string;
  seriesNameFirst: string;
  seriesNameSecond: string;
  seriesDataFirst: any;
  seriesDataSecond: number[];
  categories: string[];
}
interface Point {
  series: {
    name: string;
  };
  y: number;
}

const HighchartsComponent: React.FC<HighchartsProps> = ({
  title,
  seriesNameFirst,
  seriesNameSecond,
  seriesDataFirst,
  seriesDataSecond,
  categories,
  yAxisTitle,
}) => {
  const currency = useCurrency();
  const { formatMessage } = useIntl();

  const chartOptions = {
    title: {
      text: title,
      align: "left",
    },
    xAxis: {
      categories: categories,
    },
    yAxis: {
      title: {
        text: yAxisTitle,
      },
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
    series: [
      {
        name: seriesNameFirst,
        data: seriesDataFirst,
      },
      {
        name: seriesNameSecond,
        data: seriesDataSecond,
      },
    ],
    credits: {
      enabled: false,
    },
  };

  const noDataMessage = <p>{formatMessage({ id: "generic.noDataFound" })}</p>;

  const isShowNotFound = isEmpty(seriesDataFirst);
  return (
    <Card hoverable bodyStyle={{ position: "relative" }}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      {isShowNotFound && <div className={styles.noData}>{noDataMessage}</div>}
    </Card>
  );
};

export default HighchartsComponent;
