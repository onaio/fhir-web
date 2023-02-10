import { Button } from "@opensrp/core";
import { useIsomorphicLayoutEffect } from "@opensrp/utils";

export default function Docs() {
  useIsomorphicLayoutEffect(() => {
    console.log("opensrp docs page");
  }, []);
  return (
    <div>
      <h1>opensrp Documentation</h1>
      <Button>Click me</Button>
    </div>
  );
}
