import React from "react";

import { BackgroundSettingsForm } from "./(components)/BackgroundSettingsForm";

export default async function page() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Homepage Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage and configure your website&apos;s homepage content
        </p>
      </div>

      {/* Background Media Settings */}
      <BackgroundSettingsForm />
    </div>
  );
}
