import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";

export function EnvVarWarning() {
  return (
    <div className="flex gap-4 items-center">
      <Badge variant={"outline"} className="font-normal">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Circuits environment variables required
        </div>
      </Badge>
      <div className="flex gap-2">
        <Button size="sm" variant={"outline"} disabled>
          Sign in
        </Button>
        <Button size="sm" variant={"default"} disabled>
          Sign up
        </Button>
      </div>
    </div>
  );
}
