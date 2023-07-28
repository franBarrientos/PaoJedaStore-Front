import { Box, Heading, Flex } from "@chakra-ui/react";
import Chart from "chart.js/auto";
import { useEffect } from "react";
import apiClient from "../../config/axiosClient";
import { formatDate } from "../../utils/dates";
export default function Stadistics() {
  useEffect(() => {
    (async function () {
      let data = [
        { dia: "ayer", count: 120 },
        { dia: "hoy", count: 120 },
      ];

      let data1: any;
      let data2: any;
      try {
        const response = await apiClient.get("/purchase/stadistics", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.data.ok) throw new Error("err");
        data = response.data.body.stadisticsLast10days.map((data:{date:string,totalSales:string}) => {
          return {
            dia: formatDate(data.date),
            count: Number(data.totalSales),
          };
        });
        data1 = {
          labels: response.data.body.stadisticsProducts.map(
            (product: any) => product.productName
          ),
          datasets: [
            {
              label: "Dataset 1",
              data: response.data.body.stadisticsProducts.map(
                (product: any) => product.totalQuantity
              ),
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
                " rgb(26, 93, 26) ",
                " rgb(255, 208, 208)",
              ],
            },
          ],
        };
        data2 = {
          labels: response.data.body.stadisticsCategory.map(
            (product: any) => product.categoryName
          ),
          datasets: [
            {
              label: "Dataset 1",
              data: response.data.body.stadisticsCategory.map(
                (product: any) => product.totalQuantity
              ),
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
                " rgb(26, 93, 26) ",
                " rgb(255, 208, 208)",
              ],
            },
          ],
        };
      } catch (error) {
        data1 = {
          labels: [
            "Mouse Wesdar Gaming GM3 Blue",
            "Monitor Benq",
            "Mecanic Keyboard Logitech G513 Carbon RGB",
            "Mouse Wesdar Cerberus x4 Black Rainbow",
          ],
          datasets: [
            {
              label: "Dataset 1",
              data: [10, 30, 40, 55],
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
                " rgb(26, 93, 26) ",
              ],
            },
          ],
        };

        data2 = {
          labels: ["Red", "Orange", "Yellow", "Green"],
          datasets: [
            {
              label: "Dataset 1",
              data: [40, 10, 50],
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
              ],
            },
          ],
        };
      }

      const chartElement = document.getElementById(
        //for year
        "acquisitions"
      ) as HTMLCanvasElement | null;
      if (chartElement) {
        new Chart(chartElement, {
          type: "bar",
          data: {
            labels: data.map((row) => row.dia),
            datasets: [
              {
                label: "Total Vendido en los ultimos 10 dias",
                data: data.map((row) => row.count),
              },
            ],
          },
        });
      }

      const chartElement1 = document.getElementById(
        //most sales
        "acquisitions1"
      ) as HTMLCanvasElement | null;
      if (chartElement1) {
        new Chart(chartElement1, {
          type: "doughnut",
          data: data1,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "bottom",
                align: "center",
              },
              title: {
                display: true,
                text: "Productos mas vendidos",
                font: {
                  size: 18,
                },
              },
              tooltip: {
                boxHeight: 60,
              },
            },
          },
        });
      }
      const chartElement2 = document.getElementById(
        "acquisitions2"
      ) as HTMLCanvasElement | null;
      if (chartElement2) {
        new Chart(chartElement2, {
          type: "doughnut",
          data: data2,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "bottom",
                align: "center",
              },
              title: {
                display: true,
                text: "Categorias mas vendidas",
                font: {
                  size: 18,
                },
              },
              tooltip: {
                boxHeight: 60,
              },
            },
          },
        });
      }
    })();
  }, []);
  return (
    <Box color={"ly.700"}>
      <Heading>Estadisticas</Heading>
      <Flex alignItems={"center"} direction={"column"} gap={2}>
        <Heading>Ventas por año</Heading>
        <Box w={{ base: "300px", md: "500px", lg: "800px" }}>
          <canvas id="acquisitions"></canvas>
        </Box>
      </Flex>
      <Flex
        direction={{ base: "column", lg: "row" }}
        justifyContent={"space-around"}
        alignItems={"center"}
      >
        <Box w={{ base: "300px", md: "300px", lg: "400px" }}>
          <canvas id="acquisitions1"></canvas>
        </Box>
        <Box w={{ base: "300px", md: "300px", lg: "400px" }}>
          <canvas id="acquisitions2"></canvas>
        </Box>
      </Flex>
    </Box>
  );
}
