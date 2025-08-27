import ContributionHeatmap from "@/components/ContributionHeatmap";
import React from "react";

const ActivityPage = () => {
  return (
    <>
      <div className="px-6">
        <h2 className="mb-4 text-lg font-semibold">GitHub Contributions</h2>
        <ContributionHeatmap username="AbuArwa001" />
      </div>
    </>
  );
};

export default ActivityPage;
