import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateDesignConsultationMutation } from "../../../redux/api/jobApi";
import toast from "react-hot-toast";
import RequiredMark from "../../../Components/Common/RequiredMark";

const formatDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const DesignConsultationCreate = ({
  jobId: jobIdProp,
  initialData,
  onCancel,
  onSaved,
  mode = "create",
}) => {
  const [createDesignConsultation] = useCreateDesignConsultationMutation();

  const navigate = useNavigate();
  const { jobId } = useParams();
  const resolvedJobId = jobIdProp || jobId;

  const [productDetails, setProductDetails] = useState({
    product: "",
    colorCode: "",
    estimatedGallons: "",
  });

  const [upsellDetails, setUpsellDetails] = useState({
    upsellDescription: "",
    upsellValue: "",
    addedHours: "",
  });

  const [scheduling, setScheduling] = useState({
    estimatedStartDate: "",
  });

  const [contractFile, setContractFile] = useState(null);
  const [existingFileUrl, setExistingFileUrl] = useState("");

  useEffect(() => {
    if (!initialData) return;
    setProductDetails({
      product: initialData.product ?? "",
      colorCode: initialData.colorCode ?? "",
      estimatedGallons: initialData.estimatedGallons ?? "",
    });
    setUpsellDetails({
      upsellDescription: initialData.upsellDescription ?? "",
      upsellValue: initialData.upsellValue ?? "",
      addedHours: initialData.addedHours ?? "",
    });
    setScheduling({
      estimatedStartDate: formatDateInput(
        initialData.estimatedStartDate || initialData.startDate
      ),
    });
    setExistingFileUrl(initialData.contractUrl || initialData.file || "");
  }, [initialData]);

  const handleFileChange = (e) => {
    setContractFile(e.target.files[0]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    try {
      const formData = new FormData();

      formData.append("jobId", resolvedJobId);

      // product
      formData.append("product", productDetails.product);
      formData.append("colorCode", productDetails.colorCode);
      formData.append("estimatedGallons", productDetails.estimatedGallons);

      // upsell
      formData.append("upsellDescription", upsellDetails.upsellDescription);
      formData.append("upsellValue", upsellDetails.upsellValue);
      formData.append("addedHours", upsellDetails.addedHours);

      // scheduling
      formData.append("estimatedStartDate", scheduling.estimatedStartDate);

      // file
      if (contractFile) {
        formData.append("contract", contractFile);
      }

      await createDesignConsultation(formData).unwrap();
      toast.success(
        mode === "edit"
          ? "Design consultation updated successfully"
          : "Design consultation added successfully"
      );

      if (onSaved) {
        onSaved();
      } else {
        navigate(`/production-manager/my-jobs/${resolvedJobId}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(
        mode === "edit"
          ? "Failed to update design consultation"
          : "Failed to create design consultation"
      );
    }
  };

  return (
    <form onSubmit={handleSave} className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">
        {mode === "edit"
          ? "Edit Design Consultation"
          : "Create Design Consultation"}
      </h2>

      {/* Product Details */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Product Details</h3>

        <label className="block text-sm font-medium text-gray-700">
          Product
        </label>
        <input
          type="text"
          value={productDetails.product}
          onChange={(e) =>
            setProductDetails({ ...productDetails, product: e.target.value })
          }
          className="mt-1 p-3 w-full border rounded-md"
        />

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Color Code
          </label>
          <input
            type="text"
            value={productDetails.colorCode}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                colorCode: e.target.value,
              })
            }
            className="mt-1 p-3 w-full border rounded-md"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Estimated Gallons
          </label>
          <input
            type="number"
            value={productDetails.estimatedGallons}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                estimatedGallons: e.target.value,
              })
            }
            className="mt-1 p-3 w-full border rounded-md"
          />
        </div>
      </div>

      {/* Upsell */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Upsell</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upsell Description
          </label>
          <input
            type="text"
            placeholder="Upsell Description"
            value={upsellDetails.upsellDescription}
            onChange={(e) =>
              setUpsellDetails({
                ...upsellDetails,
                upsellDescription: e.target.value,
              })
            }
            className="mt-1 mb-3 p-3 w-full border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upsell Value
          </label>
          <input
            type="text"
            placeholder="Upsell Value"
            value={upsellDetails.upsellValue}
            onChange={(e) =>
              setUpsellDetails({
                ...upsellDetails,
                upsellValue: e.target.value,
              })
            }
            className="mt-1 mb-3 p-3 w-full border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Added Hours
          </label>
          <input
            type="number"
            placeholder="Added Hours"
            value={upsellDetails.addedHours}
            onChange={(e) =>
              setUpsellDetails({
                ...upsellDetails,
                addedHours: e.target.value,
              })
            }
            className="mt-1 mb-3 p-3 w-full border rounded-md"
          />
        </div>{" "}
      </div>

      {/* Scheduling */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Estimated Start Date
        </label>
        <input
          type="date"
          value={scheduling.estimatedStartDate}
          onChange={(e) =>
            setScheduling({
              ...scheduling,
              estimatedStartDate: e.target.value,
            })
          }
          className="mt-1 p-3 w-full border rounded-md"
        />
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contract <RequiredMark />
        </label>
        <input
          type="file"
          accept=".pdf,.docx,.xlsx"
          onChange={handleFileChange}
          required={!existingFileUrl}
        />
        {existingFileUrl && !contractFile && (
          <p className="mt-2 text-sm text-gray-600">
            Current file selected
          </p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : navigate(-1))}
          className="bg-gray-400 px-6 py-2 rounded text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 px-6 py-2 rounded text-white"
        >
          {mode === "edit" ? "Update DC" : "Create DC"}
        </button>
      </div>
    </form>
  );
};

export default DesignConsultationCreate;
