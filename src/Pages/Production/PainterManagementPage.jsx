import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiDownload, FiPlus } from "react-icons/fi";
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

const formatExcelDateLabel = (value) => {
  if (!value) return "";
  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

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
  const exportDateColumns = useMemo(() => {
    const dates = new Set();
    painters.forEach((painter) => {
      (painter.dailyWorkedHours || []).forEach((entry) => {
        if (entry?.workDate) dates.add(entry.workDate);
      });
    });
    return [...dates].sort();
  }, [painters]);

  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Painter", accessor: "fullName", sortable: true },
      { label: "Total Hours", accessor: "totalWorkedHours", sortable: true },
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

  const handleExportExcel = () => {
    if (!painters.length) {
      toast.error("No painter data to export.");
      return;
    }

    const headerColumns = [
      "Painter Name",
      "Email",
      "Status",
      "Crew",
      "Total Hours",
      ...exportDateColumns.map(formatExcelDateLabel),
    ];

    const escapeCell = (value) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const rows = painters.map((painter) => {
      const hoursByDate = new Map(
        (painter.dailyWorkedHours || []).map((entry) => [entry.workDate, entry.hours])
      );

      return [
        painter.fullName,
        painter.email,
        painter.status,
        painter.crewName,
        painter.totalWorkedHours,
        ...exportDateColumns.map((date) => hoursByDate.get(date) ?? 0),
      ];
    });

    const tableHtml = `
      <table>
        <thead>
          <tr>${headerColumns.map((column) => `<th>${escapeCell(column)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) =>
                `<tr>${row.map((cell) => `<td>${escapeCell(cell)}</td>`).join("")}</tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;

    const workbookHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:x="urn:schemas-microsoft-com:office:excel"
            xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8" />
        </head>
        <body>${tableHtml}</body>
      </html>
    `;

    const blob = new Blob([workbookHtml], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `painters-hours-${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Painter Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create painter accounts, update their status, and place them on the right crew.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <FiDownload className="h-4 w-4" />
            Export Excel
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingPainter(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <FiPlus className="h-4 w-4" />
            Add Painter
          </button>
        </div>
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
