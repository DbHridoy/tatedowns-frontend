import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import DataTable from "../../Components/Common/DataTable";
import SimpleLoader from "../../Components/Common/SimpleLoader";
import PainterFormModal from "../../Components/Production/PainterFormModal";
import {
  useAssignPainterToCrewMutation,
  useCreatePainterMutation,
  useGetCrewsQuery,
  useGetPaintersQuery,
  useRemovePainterFromCrewMutation,
  useUpdatePainterMutation,
} from "../../redux/api/productionApi";
import { normalizeCrew, normalizePainter } from "../../utils/productionCalendar";

const PainterManagementPage = () => {
  const [editingPainter, setEditingPainter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: paintersData, isLoading: isPaintersLoading } = useGetPaintersQuery();
  const { data: crewsData, isLoading: isCrewsLoading } = useGetCrewsQuery();
  const [createPainter, { isLoading: isCreatingPainter }] = useCreatePainterMutation();
  const [updatePainter, { isLoading: isUpdatingPainter }] = useUpdatePainterMutation();
  const [assignPainterToCrew] = useAssignPainterToCrewMutation();
  const [removePainterFromCrew] = useRemovePainterFromCrewMutation();

  const crews = useMemo(
    () => (crewsData?.data || []).map(normalizeCrew),
    [crewsData?.data]
  );
  const painters = useMemo(
    () => (paintersData?.data || []).map(normalizePainter),
    [paintersData?.data]
  );

  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Painter", accessor: "fullName", sortable: true },
      { label: "Email", accessor: "email" },
      { label: "Status", accessor: "status" },
      { label: "Crew", accessor: "crewName" },
    ],
    totalItems: painters.length,
    currentPage: 1,
    itemsPerPage: Math.max(painters.length, 1),
    sortKey: "",
    sortOrder: "asc",
    showSearch: false,
    showPagination: false,
    actions: [
      {
        label: "Edit",
        className: "bg-blue-500 text-white p-2 rounded-lg",
        onClick: (item) => {
          setEditingPainter(item);
          setIsModalOpen(true);
        },
      },
    ],
  };

  const syncCrewAssignment = async (painterId, previousCrewId, nextCrewId) => {
    if (previousCrewId && previousCrewId !== nextCrewId) {
      await removePainterFromCrew({
        crewId: previousCrewId,
        painterId,
      }).unwrap();
    }

    if (nextCrewId && nextCrewId !== previousCrewId) {
      await assignPainterToCrew({
        crewId: nextCrewId,
        painterId,
      }).unwrap();
    }
  };

  const handleSavePainter = async (payload) => {
    const trimmedPayload = {
      fullName: payload.fullName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      isActive: payload.status !== "inactive",
    };

    try {
      if (editingPainter?._id) {
        const updatePayload = { ...trimmedPayload };
        if (payload.password) updatePayload.password = payload.password;

        await updatePainter({
          painterId: editingPainter._id,
          ...updatePayload,
        }).unwrap();
        await syncCrewAssignment(
          editingPainter._id,
          editingPainter.crewId || "",
          payload.crewId || ""
        );
        toast.success("Painter updated.");
      } else {
        const created = await createPainter({
          ...trimmedPayload,
          password: payload.password,
        }).unwrap();
        const painterId = created?.data?._id || created?._id;

        if (painterId && payload.crewId) {
          await assignPainterToCrew({
            crewId: payload.crewId,
            painterId,
          }).unwrap();
        }
        toast.success("Painter created.");
      }

      setEditingPainter(null);
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save painter.");
    }
  };

  return (
    <div className="page-container space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Painter Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create painter accounts, update their status, and place them on the right crew.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingPainter(null);
            setIsModalOpen(true);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Painter
        </button>
      </div>

      {isPaintersLoading || isCrewsLoading ? (
        <SimpleLoader text="Loading painters..." className="min-h-[280px]" />
      ) : (
        <DataTable title="Painters" data={painters} config={tableConfig} />
      )}

      <PainterFormModal
        isOpen={isModalOpen}
        painter={editingPainter}
        crews={crews}
        isSubmitting={isCreatingPainter || isUpdatingPainter}
        onClose={() => {
          setEditingPainter(null);
          setIsModalOpen(false);
        }}
        onSubmit={handleSavePainter}
      />
    </div>
  );
};

export default PainterManagementPage;
