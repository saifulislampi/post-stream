import React from "react";

const trendingData = [
  {
    title: "#React",
    count: "2,845 posts"
  },
  {
    title: "#JavaScript",
    count: "1,234 posts"
  },
  {
    title: "#ModernWebDev",
    count: "892 posts"
  }
];

export default function TrendingWidget() {
  return (
    <div className="widget">
      <div className="widget-header">
        <h5 className="widget-title">What's happening</h5>
      </div>
      <div className="widget-content">
        {trendingData.map((trend, index) => (
          <div key={index} className="widget-item">
            <a href="#" className="trend-item">
              {/* <div className="trend-category">{trend.category}</div> */}
              <div className="trend-title">{trend.title}</div>
              <div className="trend-count">{trend.count}</div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}