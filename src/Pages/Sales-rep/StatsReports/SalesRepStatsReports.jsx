import StatsCard from "../../../Components/Sales-rep/StatsReports/StatsCard";
import Leaderboard from "../../../Components/Sales-rep/StatsReports/Leaderboard";
import PersonalMetrics from "../../../Components/Sales-rep/StatsReports/PersonalMetrics";
import JobPipeline from "../../../Components/Sales-rep/StatsReports/JobPipeline";

const StatsReports = () => {
  return (
    <div className="mx-auto p-6 space-y-6">
      {/* 1. Stats Card */}
      <StatsCard />

      {/* 2. Leaderboard + Personal Metrics in same row with equal height */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        <div className="flex-1">
          <Leaderboard />
        </div>
        <div className="flex-1">
          <PersonalMetrics />
        </div>
      </div>

      {/* 3. Job Pipeline */}
      <JobPipeline />
    </div>
  );
};

export default StatsReports;
