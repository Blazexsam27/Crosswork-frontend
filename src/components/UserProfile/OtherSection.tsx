import { Button } from "../ui/button";
import { CustomDialog } from "../widgets/DialogPopup";
import { DialogClose } from "../ui/dialog";

function OtherSection() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Settings</h2>
      <div className="space-y-6">
        <div className="border border-gray-200 rounded-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Privacy Settings
          </h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
              <span className="ml-2 text-gray-700">
                Make profile visible to other students
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
              <span className="ml-2 text-gray-700">
                Allow direct messages from other users
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Show online status</span>
            </label>
          </div>
        </div>

        <div className="border border-red-200 rounded-sm p-4">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Danger Zone
          </h3>
          <p className="text-gray-600 mb-4">These actions cannot be undone.</p>

          <CustomDialog
            title="Delete Account"
            description="Are you sure you want to delete your account? This action cannot be undone."
            triggerText="Delete Account"
            triggerVariant="destructive"
            footerContent={
              <>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="destructive">Confirm Deletion</Button>
              </>
            }
          >
            <div className="py-4 space-y-2">
              <p className="text-gray-700">
                All your data will be permanently removed. This includes:
              </p>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Your profile information</li>
                <li>All created threads and comments</li>
                <li>Message history</li>
              </ul>
            </div>
          </CustomDialog>
        </div>
      </div>
    </div>
  );
}

export default OtherSection;
