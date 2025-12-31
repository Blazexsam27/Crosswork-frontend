import { Button } from "../ui/button";
import { CustomDialog } from "../widgets/DialogPopup";
import { DialogClose } from "../ui/dialog";

function OtherSection() {
  return (
    <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Other Settings
      </h2>
      <div className="space-y-6">
        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Privacy Settings
          </h3>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-border text-primary focus:ring-primary"
                defaultChecked
              />
              <span className="ml-3 text-foreground">
                Make profile visible to other students
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-border text-primary focus:ring-primary"
                defaultChecked
              />
              <span className="ml-3 text-foreground">
                Allow direct messages from other users
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="ml-3 text-foreground">Show online status</span>
            </label>
          </div>
        </div>

        <div className="border border-destructive/30 rounded-lg p-4 bg-destructive/5">
          <h3 className="text-lg font-semibold text-destructive mb-2">
            Danger Zone
          </h3>
          <p className="text-muted-foreground mb-4">
            These actions cannot be undone.
          </p>

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
              <p className="text-foreground font-medium">
                All your data will be permanently removed. This includes:
              </p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Your profile information</li>
                <li>All created threads and comments</li>
                <li>Message history</li>
                <li>Room participation records</li>
              </ul>
            </div>
          </CustomDialog>
        </div>
      </div>
    </div>
  );
}

export default OtherSection;
