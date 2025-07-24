import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubtleInfoText from "../shared/SubtleInfoText";
import { getTrendingHashtags } from "../../services/trending.js";

const TrendingWidget = () => {
  const [trendingData, setTrendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrending = async () => {
      setLoading(true);
      try {
        const data = await getTrendingHashtags(3);
        setTrendingData(data);
      } catch {
        setTrendingData([]);
      } finally {
        setLoading(false);
      }
    };
    // Initial load
    loadTrending();
    // Refresh when a new post is created
    window.addEventListener('postCreated', loadTrending);
    // Refresh every 5 minutes
    const intervalId = setInterval(loadTrending, 5 * 60 * 1000);
    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('postCreated', loadTrending);
      clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return (
      <div className="widget">
        <div className="widget-header">
          <h5 className="widget-title">What's happening</h5>
        </div>
        <div className="widget-content">
          <div style={{ padding: '1rem', textAlign: 'center' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="widget">
      <div className="widget-header">
        <h5 className="widget-title">What's happening</h5>
        {!trendingData.length && <SubtleInfoText>(No trending data)</SubtleInfoText>}
      </div>
      <div className="widget-content">
        {trendingData.map((trend, index) => (
          <div key={index} className="widget-item">
            <button
              type="button"
              className="trend-item"
              onClick={() => navigate(`/hashtag/${trend.hashtag}`)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                textAlign: 'left',
                width: '100%',
                cursor: 'pointer'
              }}
            >
              <div className="trend-title">{trend.title}</div>
              <div className="trend-count">{trend.count}</div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingWidget;
