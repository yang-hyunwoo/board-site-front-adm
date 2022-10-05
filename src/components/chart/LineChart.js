import { defineComponent, h } from "vue";

import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
);

export default defineComponent({
  name: "LineChart",
  components: {
    Line
  },
  props: {
    chartId: {
      type: String,
      default: "line-chart"
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: "",
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Array,
      default: () => []
    },
    laebelss : {
      type: Array,
      default : () => []
    },
    datass : {
      type: Array,
      default : () => []
    }
  },
  setup(props) {
    const chartData = {
      labels: props.laebelss,
      datasets: [
        {
          label: "결제 인원",
          backgroundColor: "#f87979",
          data: props.datass
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false
    };

    return () =>
      h(Line, {
        chartData,
        chartOptions,
        chartId: props.chartId,
        width: props.width,
        height: props.height,
        cssClasses: props.cssClasses,
        styles: props.styles,
        plugins: props.plugins
      });
  }
});