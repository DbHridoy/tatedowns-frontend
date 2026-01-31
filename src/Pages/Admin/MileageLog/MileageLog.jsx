import ExpenseBreakdown from "../../../Components/Dashboard/ExpenseBreakdown";
import ExpensesData from "../../../Components/Dashboard/ExpensesData";
import ReportsData from "../../../Components/Dashboard/ReportsData";

const MileageLog = () => {
  return (
    <div>
      <MileageLogData />
      <ReportsData />
      <ExpenseBreakdown />
    </div>
  );
};

export default MileageLog;
