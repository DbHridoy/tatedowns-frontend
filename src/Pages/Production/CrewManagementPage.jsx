import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import DataTable from "../../Components/Common/DataTable";
import SimpleLoader from "../../Components/Common/SimpleLoader";
import CrewAssignmentModal from "../../Components/Production/CrewAssignmentModal";
import CrewFormModal from "../../Components/Production/CrewFormModal";
import {
  useAssignPainterToCrewMutation,
  useCreateCrewMutation,
  useGetCrewsQuery,
  useGetPaintersQuery,
  useRemovePainterFromCrewMutation,
  useUpdateCrewMutation,
} from "../../redux/api/productionApi";
import { normalizeCrew, normalizePainter } from "../../utils/productionCalendar";

const CrewManagementPage = () => {
  const [editingCrew, setEditingCrew] = useState(null);
  const [managingCrew, setManagingCrew] = useState(null);
  const [isCrewModalOpen, setIsCrewModalOpen] = useState(false);
  const { data: crewsData, isLoading: isCrewsLoading } = useGetCrewsQuery();
  const { data: paintersData, isLoading: isPaintersLoading } = useGetPaintersQuery();
  const [createCrew, { isLoading: isCreatingCrew }] = useCreateCrewMutation();
  const [updateCrew, { isLoading: isUpdatingCrew }] = useUpdateCrewMutation();
  const [assignPainterToCrew, { isLoading: isAssigningPainter }] =
    useAssignPainterToCrewMutation();
  const [removePainterFromCrew, { isLoading: isRemovingPainter }] =
    useRemovePainterFromCrewMutation();

  const crews = useMemo(
    () => (crewsData?.data || []).map(normalizeCrew),
    [crewsData?.data]
  );
  const painters = useMemo(
    () => (paintersData?.data || []).map(normalizePainter),
    [paintersData?.data]
  );

  const tableRows = crews.map((crew) => ({
    ...crew,
    painterCount: crew.painters?.length || 0,
    painterNames: (crew.painters || [])
      .map((painter) => painter.fullName || painter.name)
      .filter(Boolean)
      .join(", "),
  }));

  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Crew Name", accessor: "name", sortable: true },
      { label: "Status", accessor: "status" },
      { label: "Painters", accessor: "painterCount" },
      {
        label: "Assigned Painters",
        accessor: "painterNames",
        format: (value) => value || "None assigned",
      },
    ],
    totalItems: tableRows.length,
    currentPage: 1,
    itemsPerPage: Math.max(tableRows.length, 1),
    sortKey: "",
    sortOrder: "asc",
    showSearch: false,
    showPagination: false,
    actions: [
      {
        label: "Edit",
        className: "bg-blue-500 text-white p-2 rounded-lg",
        onClick: (item) => {
          setEditingCrew(item);
          setIsCrewModalOpen(true);
        },
      },
      {
        label: "Manage Painters",
        className: "bg-slate-700 text-white p-2 rounded-lg",
        onClick: (item) => setManagingCrew(item),
      },
    ],
  };

  const handleSaveCrew = async (payload) => {
    try {
      if (editingCrew?._id) {
        await updateCrew({ crewId: editingCrew._id, ...payload }).unwrap();
        toast.success("Crew updated.");
      } else {
        await createCrew(payload).unwrap();
        toast.success("Crew created.");
      }
      setEditingCrew(null);
      setIsCrewModalOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save crew.");
    }
  };

  const handleSaveAssignments = async (selectedPainterIds) => {
    if (!managingCrew?._id) return;

    const currentPainterIds = new Set(
      (managingCrew.painters || []).map((painter) => painter._id || painter.id)
    );
    const nextPainterIds = new Set(selectedPainterIds);

    try {
      const additions = selectedPainterIds.filter((id) => !currentPainterIds.has(id));
      const removals = [...currentPainterIds].filter((id) => !nextPainterIds.has(id));

      await Promise.all(
        additions.map((painterId) =>
          assignPainterToCrew({ crewId: managingCrew._id, painterId }).unwrap()
        )
      );
      await Promise.all(
        removals.map((painterId) =>
          removePainterFromCrew({ crewId: managingCrew._id, painterId }).unwrap()
        )
      );

      toast.success("Crew assignments updated.");
      setManagingCrew(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update crew assignments.");
    }
  };

  return (
    <div className="page-container space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Crew Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create production crews, update their status, and control painter assignments.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingCrew(null);
            setIsCrewModalOpen(true);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create Crew
        </button>
      </div>

      {isCrewsLoading || isPaintersLoading ? (
        <SimpleLoader text="Loading crews..." className="min-h-[280px]" />
      ) : (
        <DataTable
          title="Crews"
          data={tableRows}
          config={tableConfig}
        />
      )}

      <CrewFormModal
        isOpen={isCrewModalOpen}
        crew={editingCrew}
        isSubmitting={isCreatingCrew || isUpdatingCrew}
        onClose={() => {
          setEditingCrew(null);
          setIsCrewModalOpen(false);
        }}
        onSubmit={handleSaveCrew}
      />

      <CrewAssignmentModal
        isOpen={Boolean(managingCrew)}
        crew={managingCrew}
        painters={painters}
        isSubmitting={isAssigningPainter || isRemovingPainter}
        onClose={() => setManagingCrew(null)}
        onSubmit={handleSaveAssignments}
      />
    </div>
  );
};

export default CrewManagementPage;

