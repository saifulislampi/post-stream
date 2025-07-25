import React from "react";
import TrendingWidget from "./TrendingWidget";
import WhoToFollowWidget from "./WhoToFollowWidget";

export default function RightSidebar({ currentProfile }) {
  return (
    <aside className="right-sidebar d-none d-xl-block">
      <div style={{ paddingTop: "1rem" }}>
        <TrendingWidget />
        <WhoToFollowWidget currentProfile={currentProfile} />
      </div>
    </aside>
  );
}
