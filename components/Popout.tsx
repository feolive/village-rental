import { useClick, useFloating } from "@floating-ui/react";
import { ReactElement, ReactHTMLElement, ReactNode, useState } from "react";


export default function Popout(node: ReactElement) {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: true,
    onOpenChange: setIsOpen,
  });

  return (
    <>
      <div>
        <div ref={refs.setReference}>{node}</div>
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="card bg-neutral text-neutral-content w-96"
        >
          <div className="card-body items-center text-center">
            <h2 className="card-title">Cookies!</h2>
            <p>We are using cookies for no reason.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Accept</button>
              <button className="btn btn-ghost">Deny</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
