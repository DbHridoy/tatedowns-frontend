import SimpleLoader from "../../Components/Common/SimpleLoader";
import { useGetPainterOwnCrewQuery } from "../../redux/api/productionApi";
import { normalizeCrew } from "../../utils/productionCalendar";

const PainterCrewPage = () => {
  const { data, isLoading } = useGetPainterOwnCrewQuery();
  const crew = data?.data ? normalizeCrew(data.data) : null;

  if (isLoading) {
    return <SimpleLoader text="Loading crew..." className="min-h-[280px]" />;
  }

  return (
    <div className="page-container space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Crew</h1>
        <p className="mt-1 text-sm text-gray-500">
          Painter-safe crew details only. Sensitive financial and internal notes stay hidden.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Crew Name</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">
          {crew?.name || "No crew assigned"}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Status: {crew?.status || "Unknown"}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Crew Roster</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(crew?.painters || []).length ? (
            crew.painters.map((painter) => (
              <div
                key={painter._id || painter.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <p className="font-medium text-slate-800">
                  {painter.fullName || painter.name}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {painter.email || "No email available"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Crew roster is not available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PainterCrewPage;

