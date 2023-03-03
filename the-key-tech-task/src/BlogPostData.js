import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const BlogPostData = ({ post }) => {
  const chartRef = useRef(null);
  const getWords = Object.keys(post.wordCountMap);

  useEffect(() => {
    if (post && chartRef.current) {
      const labels = [];
      const data = [];

      getWords.forEach((word) => {
        labels.push(word);
        data.push(post.wordCountMap[word]);
      });

      const wordCountChart = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Word Count",
              data: data,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
              barThickness: 20,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });

      return () => {
        wordCountChart.destroy();
      };
    }
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h3>{post.title}</h3>
      <div style={{ width: "100%", overflowX: "scroll" }}>
        <div
          style={{
            width: `${getWords.length * 40}px`,
            height: 300,
          }}
        >
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  );
};

export default BlogPostData;
