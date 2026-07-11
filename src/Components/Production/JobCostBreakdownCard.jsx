import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import formatCurrency from "../../utils/formatCurrency";
import { normalizeCostSummary } from "../../utils/productionCalendar";

const CHART_COLORS = ["#0f766e", "#f59e0b", "#2563eb", "#dc2626"];

const JobCostBreakdownCard = ({ costSummary, title = "Job Cost Breakdown" }) => {
  const summary = normalizeCostSummary(costSummary);
  const chartData = summary.chartSegments.filter((segment) => segment.value > 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Price, labor, materials, and gross profit based on recorded production hours and expenses.
          </p>
        </div>
        {summary.overBudget > 0 ? (
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
            Over budget by {formatCurrency(summary.overBudget)}
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Job Price</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {formatCurrency(summary.jobPrice)}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Actual Hours</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {summary.totalLoggedHours.toFixed(2)}h
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Labor Cost</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {formatCurrency(summary.laborCost)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Includes {summary.burdenMultiplier.toFixed(2)}x burden
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Material Cost</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {formatCurrency(summary.materialCost)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-6 xl:grid-cols-[1.25fr,0.85fr]">
        <div className="grid gap-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-700">Direct Labor</p>
              <p className="text-sm font-semibold text-slate-900">
                {formatCurrency(summary.directLaborCost)}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-700">Burdened Labor</p>
              <p className="text-sm font-semibold text-slate-900">
                {formatCurrency(summary.laborCost)} ({summary.laborPercentOfPrice.toFixed(2)}%)
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-700">Materials</p>
              <p className="text-sm font-semibold text-slate-900">
                {formatCurrency(summary.materialCost)} ({summary.materialPercentOfPrice.toFixed(2)}%)
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-700">Total Cost</p>
              <p className="text-sm font-semibold text-slate-900">
                {formatCurrency(summary.totalCost)} ({summary.totalCostPercentOfPrice.toFixed(2)}%)
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-200">Gross Profit</p>
              <p className="text-sm font-semibold">
                {formatCurrency(summary.grossProfit)} ({summary.grossProfitMarginPercent.toFixed(2)}%)
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={62}
                  outerRadius={96}
                  paddingAngle={2}
                  label={({ payload }) =>
                    `${payload.label} ${payload.percentOfPrice.toFixed(0)}%`
                  }
                >
                  {chartData.map((segment, index) => (
                    <Cell
                      key={segment.key || index}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, item) => [
                    `${formatCurrency(value)} (${Number(item?.payload?.percentOfPrice || 0).toFixed(2)}%)`,
                    name,
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCostBreakdownCard;
