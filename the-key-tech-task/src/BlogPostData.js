import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const BlogPostData = ({ post }) => {
  const chartRef = useRef(null); // creates a reference to the chart canvas
  const getWords = Object.keys(post.wordCountMap); // gets the words from the wordCountMap object as an array

  // ensures that the chart object is properly created, destroyed and updated
  useEffect(() => {
    // safety measure, in case the data has not loaded yet
    if (post && chartRef.current) {
      const labels = [];
      const data = [];

      // loops through each word of the word-count map to create the labels & values for the chart
      getWords.forEach((word) => {
        labels.push(word);
        data.push(post.wordCountMap[word]);
      });

      // creates a new bar chart instance
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
        // cleanup function to destroy the chart on unmount of component
        wordCountChart.destroy();
      };
    }
  });

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
