import TeacherLayout from "@/components/teacher/TeacherLayout";
import { GOOGLE_SHEET_CRM_URL, GOOGLE_SHEET_ID, GOOGLE_SHEET_RANGE } from "@/lib/crm-bridge";

export default function TeacherSettings() {
  return (
    <TeacherLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-50">Settings</h1>
        <p className="text-slate-400 mt-1">CRM integration & portal config</p>
      </header>

      <div className="rounded-2xl border border-white/5 p-6 space-y-3"
        style={{ background: "rgba(22,22,24,0.7)", backdropFilter: "blur(12px)" }}>
        <h3 className="text-lg font-semibold text-slate-100">Google Sheets CRM</h3>
        <p className="text-sm text-slate-400">
          Activity rows are mirrored to your Google Sheet via the connected workspace integration.
          Update <code className="text-violet-300">src/lib/crm-bridge.ts</code> to point to your sheet.
        </p>
        <div className="text-xs text-slate-500 space-y-1 font-mono">
          <div>SHEET_ID: {GOOGLE_SHEET_ID}</div>
          <div>RANGE: {GOOGLE_SHEET_RANGE}</div>
          <div>WEBHOOK URL: {GOOGLE_SHEET_CRM_URL}</div>
        </div>
      </div>
    </TeacherLayout>
  );
}
