import React from "react";

import ReportCard from "../../../Components/Production-Manager/ReportCard/ReportCard";
import PipelineOverview from "../../../Components/Admin/Dashboard/PipelineOverview";

const ProductionReport = () => {
  return (
    <div className="space-y-2">
      <ReportCard />
      <PipelineOverview />
    </div>
  );
};

export default ProductionReport;
