import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";



function Pipeline({ data }) {
  //console.log("data from pipeline:", data);
  return (
    <div className="flex-1 bg-white shadow-md rounded-xl px-5 py-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
        Pipeline Overview
      </h2>

      <div className="bg-white rounded-xl p-3 w-full h-60 sm:h-72 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Pipeline;
