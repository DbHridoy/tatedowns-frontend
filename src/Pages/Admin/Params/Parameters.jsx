import MileageRate from "../../../Components/Admin/Params/MileageRate";
import FiscalYear from "../../../Components/Admin/Params/FiscalYear";
import Quickbooks from "../../../Components/Admin/Params/Quickbooks";
import { useState } from "react";
import SalesRepCommission from "../../../Components/Admin/Params/SalesRepCommission";

const Parameters = () => {
  const [activeTab, setActiveTab] = useState("mileage");
  return (
    <div className="min-h-screen page-container space-y-6">
      <MileageRate />
      <SalesRepCommission />
    </div>
  );
};

export default Parameters;
